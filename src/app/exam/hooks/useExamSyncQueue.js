"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { abortTimeout } from "../utils/abortTimeout";

// Max retries before an entry is marked "failed" (still recoverable on reload
// or by the periodic drain — but no more automatic in-page retries).
const MAX_RETRIES = 8;
// Per-entry exponential backoff. Drainer respects nextRetryAt.
function backoffDelay(attempts) {
  return Math.min(1000 * 2 ** attempts, 30000); // 1, 2, 4, 8, 16, 30, 30, 30 s
}
const PERIODIC_DRAIN_MS = 5000;
const FETCH_TIMEOUT_MS = 15000;
// Stale-queue sweep: discard any leftover exam-queue:* localStorage entries
// on shared-computer systems older than this. Per-attempt keys never collide,
// but they accumulate forever otherwise.
const STALE_QUEUE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const QUEUE_KEY_PREFIX = "exam-queue:";

function cleanupStaleQueues() {
  if (typeof localStorage === "undefined") return;
  try {
    const now = Date.now();
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(QUEUE_KEY_PREFIX)) continue;
      let parsed;
      try {
        parsed = JSON.parse(localStorage.getItem(key) || "{}");
      } catch {
        toRemove.push(key);
        continue;
      }
      const newest = Math.max(
        0,
        ...Object.values(parsed || {}).map((e) => Number(e?.queuedAt || 0)),
      );
      if (newest && now - newest > STALE_QUEUE_TTL_MS) {
        toRemove.push(key);
      } else if (!newest) {
        // Empty/unrecognized shape — drop it.
        toRemove.push(key);
      }
    }
    for (const k of toRemove) localStorage.removeItem(k);
  } catch {
    /* ignore — never crash the exam page on housekeeping */
  }
}

function classifyNetworkError(err) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "Your device is offline";
  }
  if (err?.name === "TimeoutError" || err?.name === "AbortError") {
    return "Connection too slow (request timed out after 15s)";
  }
  if (err?.message?.toLowerCase().includes("failed to fetch")) {
    return "Network connection dropped";
  }
  return `Network error: ${err?.message || err?.name || "unknown"}`;
}

/**
 * Local-first answer sync for exam attempts.
 *
 * Guarantees:
 *  - Every queueAnswer() call writes the payload to localStorage BEFORE any
 *    network attempt. A tab close at any moment leaves the answer durable.
 *  - One sync attempt at a time (isDrainingRef). No duplicate-send waves on
 *    reconnect.
 *  - Per-entry retry counter and exponential backoff. After MAX_RETRIES the
 *    entry is marked "failed" but stays in localStorage (recoverable on
 *    reload).
 *  - Hydrates from localStorage on mount: any answers queued in a prior
 *    session are re-queued and drained.
 *  - Server terminal responses (401/404/409/410) cause onTerminal() to fire
 *    and the queue is wiped + drainer stops.
 *  - Latest payload per questionID always wins (Map keyed by qID, not array).
 *
 * @param {object} args
 * @param {string} args.examID
 * @param {string} args.attemptID
 * @param {(info: {status:number, message?:string, code?:string}) => void} args.onTerminal
 * @returns {{
 *   queueAnswer: (qID: string, payload: object) => void,
 *   drainNow: () => void,
 *   status: Record<string, "saving" | "unsynced" | "failed">,
 *   pendingCount: number,
 *   isOnline: boolean,
 *   lastFailReason: string | null,
 *   hasUnsynced: boolean,
 *   hasFailed: boolean,
 * }}
 */
export function useExamSyncQueue({ examID, attemptID, onTerminal }) {
  const storageKey = `${QUEUE_KEY_PREFIX}${examID}:${attemptID}`;
  // Map<qID, { payload, attempts, nextRetryAt, lastError, queuedAt, status }>
  // status: "queued" (waiting), "syncing" (in-flight), "failed" (max retries hit), "terminal" (server says stop)
  const queueRef = useRef(new Map());
  const isDrainingRef = useRef(false);
  const drainTimerRef = useRef(null);
  const onTerminalRef = useRef(onTerminal);
  onTerminalRef.current = onTerminal;

  // Reactive state derived from the queue. We rebuild on every persist().
  const [pendingCount, setPendingCount] = useState(0);
  const [statusMap, setStatusMap] = useState({});
  const [lastFailReason, setLastFailReason] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Forensic counters submitted with the final exam payload so admins can
  // verify or refute student "I answered everything" claims.
  // Stored in refs (no re-render needed) and read at submit time.
  const sessionStatsRef = useRef({
    totalRetryAttempts: 0,
    totalNetworkDrops: 0,
    totalOfflineMs: 0,
    failedQuestionIDs: new Set(),
    sessionStartedAt: Date.now(),
    lastOfflineAt: null,
  });

  // Sync the reactive state from queueRef + localStorage in one atomic op.
  const flushState = useCallback(() => {
    // localStorage first — tab can die any moment after this.
    try {
      const obj = {};
      for (const [k, v] of queueRef.current.entries()) {
        if (v.status === "terminal") continue; // don't persist terminal
        obj[k] = v;
      }
      if (Object.keys(obj).length === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(obj));
      }
    } catch {
      /* localStorage may be unavailable (private mode, full disk) */
    }

    // Now React state.
    let count = 0;
    let anyFailed = false;
    const sm = {};
    for (const [k, v] of queueRef.current.entries()) {
      if (v.status === "syncing") {
        sm[k] = "saving";
        count++;
      } else if (v.status === "queued") {
        sm[k] = "unsynced";
        count++;
      } else if (v.status === "failed") {
        sm[k] = "failed";
        count++;
        anyFailed = true;
      }
    }
    setPendingCount(count);
    setStatusMap(sm);
    if (count === 0) setLastFailReason(null);
  }, [storageKey]);

  // ------------------------------------------------------------------
  // sendOne: one network attempt for a single entry. Mutates queueRef.
  // ------------------------------------------------------------------
  const sendOne = useCallback(
    async (qID) => {
      const entry = queueRef.current.get(qID);
      if (!entry || entry.status !== "queued") return;
      // Mark syncing
      queueRef.current.set(qID, { ...entry, status: "syncing" });
      flushState();

      let res;
      try {
        res = await fetch(
          `/api/exams/${examID}/${attemptID}/question-response`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry.payload),
            signal: abortTimeout(FETCH_TIMEOUT_MS),
          },
        );
      } catch (err) {
        const reason = classifyNetworkError(err);
        const attempts = (entry.attempts || 0) + 1;
        sessionStatsRef.current.totalRetryAttempts++;
        if (attempts >= MAX_RETRIES) {
          sessionStatsRef.current.failedQuestionIDs.add(qID);
        }
        queueRef.current.set(qID, {
          ...entry,
          status: attempts >= MAX_RETRIES ? "failed" : "queued",
          attempts,
          nextRetryAt: Date.now() + backoffDelay(attempts),
          lastError: reason,
        });
        setLastFailReason(reason);
        flushState();
        return;
      }

      const data = await res.json().catch(() => null);
      // Success → drop the entry entirely.
      if (data?.success) {
        queueRef.current.delete(qID);
        flushState();
        return;
      }

      // Terminal server states: redirect (caller decides what to do).
      if (res.status === 401 || res.status === 404 || res.status === 409 || res.status === 410) {
        queueRef.current.set(qID, { ...entry, status: "terminal", lastError: data?.message });
        // Drop everything — no point queuing more.
        for (const k of [...queueRef.current.keys()]) {
          if (k !== qID) queueRef.current.delete(k);
        }
        try { localStorage.removeItem(storageKey); } catch {}
        setStatusMap({});
        setPendingCount(0);
        onTerminalRef.current?.({ status: res.status, message: data?.message, code: data?.code });
        return;
      }

      // Other 4xx/5xx: retry with backoff.
      const reason = `Server ${res.status}: ${data?.message || "no message"}`;
      const attempts = (entry.attempts || 0) + 1;
      sessionStatsRef.current.totalRetryAttempts++;
      if (attempts >= MAX_RETRIES) {
        sessionStatsRef.current.failedQuestionIDs.add(qID);
      }
      queueRef.current.set(qID, {
        ...entry,
        status: attempts >= MAX_RETRIES ? "failed" : "queued",
        attempts,
        nextRetryAt: Date.now() + backoffDelay(attempts),
        lastError: reason,
      });
      setLastFailReason(reason);
      flushState();
    },
    [examID, attemptID, flushState, storageKey],
  );

  // ------------------------------------------------------------------
  // drain: process all queued entries whose nextRetryAt is now-or-past.
  // Runs serially. Concurrency-guarded.
  // ------------------------------------------------------------------
  const drain = useCallback(async () => {
    if (isDrainingRef.current) return;
    isDrainingRef.current = true;
    try {
      while (true) {
        const now = Date.now();
        const ready = [...queueRef.current.entries()].filter(
          ([, v]) => v.status === "queued" && (v.nextRetryAt || 0) <= now,
        );
        if (ready.length === 0) break;
        for (const [qID] of ready) {
          // Re-check status — could have changed mid-loop
          const cur = queueRef.current.get(qID);
          if (!cur || cur.status !== "queued") continue;
          await sendOne(qID);
        }
      }
    } finally {
      isDrainingRef.current = false;
    }
  }, [sendOne]);

  // Also expose a fire-and-forget drainer that schedules but doesn't await.
  const drainNow = useCallback(() => {
    drain();
  }, [drain]);

  // ------------------------------------------------------------------
  // Public: enqueue an answer. Always writes localStorage first.
  // ------------------------------------------------------------------
  const queueAnswer = useCallback(
    (questionID, payload) => {
      const existing = queueRef.current.get(questionID);
      // Always reset to queued: latest payload wins, retry counter resets.
      queueRef.current.set(questionID, {
        payload,
        attempts: 0,
        nextRetryAt: 0,
        lastError: null,
        queuedAt: existing?.queuedAt || Date.now(),
        status: "queued",
      });
      flushState();
      drainNow();
    },
    [flushState, drainNow],
  );

  // ------------------------------------------------------------------
  // Hydrate from localStorage on mount + sweep stale queues left over from
  // previous students on shared computers.
  // ------------------------------------------------------------------
  useEffect(() => {
    cleanupStaleQueues();
    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored) || {};
      const ids = Object.keys(parsed);
      if (ids.length === 0) return;
      for (const id of ids) {
        // Reset to queued on hydration so it retries fresh; keep attempts so
        // we don't infinite-retry a permanently-broken payload.
        queueRef.current.set(id, {
          ...parsed[id],
          status: "queued",
          nextRetryAt: 0,
        });
      }
      flushState();
      // Drain after a short delay so React settles + network is up.
      setTimeout(() => drainNow(), 500);
    } catch {
      /* corrupt localStorage — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Public: explicitly clear this attempt's queue (call on submit success
  // or when fetchQuestion sees status=COMPLETED).
  const clearQueue = useCallback(() => {
    queueRef.current.clear();
    try { localStorage.removeItem(storageKey); } catch {}
    setStatusMap({});
    setPendingCount(0);
    setLastFailReason(null);
  }, [storageKey]);

  // ------------------------------------------------------------------
  // Online/offline event listeners + periodic drain timer.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine ?? true);
    const onOnline = () => {
      setIsOnline(true);
      // Forensic: accumulate offline duration if we tracked the drop.
      const stats = sessionStatsRef.current;
      if (stats.lastOfflineAt != null) {
        stats.totalOfflineMs += Date.now() - stats.lastOfflineAt;
        stats.lastOfflineAt = null;
      }
      // Reset all backoffs so reconnect drains immediately.
      for (const [k, v] of queueRef.current.entries()) {
        if (v.status === "queued") {
          queueRef.current.set(k, { ...v, nextRetryAt: 0 });
        } else if (v.status === "failed") {
          // Give failed entries one more chance on reconnect.
          queueRef.current.set(k, { ...v, status: "queued", nextRetryAt: 0 });
          sessionStatsRef.current.failedQuestionIDs.delete(k);
        }
      }
      flushState();
      drainNow();
    };
    const onOffline = () => {
      setIsOnline(false);
      const stats = sessionStatsRef.current;
      stats.totalNetworkDrops++;
      stats.lastOfflineAt = Date.now();
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    drainTimerRef.current = setInterval(() => {
      if (navigator.onLine) drainNow();
    }, PERIODIC_DRAIN_MS);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      if (drainTimerRef.current) clearInterval(drainTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasUnsynced = pendingCount > 0;
  const hasFailed = Object.values(statusMap).some((s) => s === "failed");

  // Live getter: reads the current queue size directly from the ref.
  // Use this from inside async callbacks (e.g. submitExam's wait loop)
  // where the React-state `pendingCount` would be a stale snapshot.
  const getPendingCount = useCallback(
    () =>
      [...queueRef.current.values()].filter(
        (v) => v.status === "queued" || v.status === "syncing" || v.status === "failed",
      ).length,
    [],
  );

  // Forensic snapshot of this exam session — submitted with the final
  // submit-exam payload so admin/audit can see network behavior on the
  // student's device, not just the server-visible save outcomes.
  const getSessionStats = useCallback(() => {
    const stats = sessionStatsRef.current;
    // Include any in-progress offline window in the total.
    let totalOfflineMs = stats.totalOfflineMs;
    if (stats.lastOfflineAt != null) {
      totalOfflineMs += Date.now() - stats.lastOfflineAt;
    }
    return {
      totalRetryAttempts: stats.totalRetryAttempts,
      totalNetworkDrops: stats.totalNetworkDrops,
      totalOfflineMs,
      failedQuestionIDs: [...stats.failedQuestionIDs],
      sessionDurationMs: Date.now() - stats.sessionStartedAt,
      finalPendingCount: getPendingCount(),
    };
  }, [getPendingCount]);

  return {
    queueAnswer,
    drainNow,
    clearQueue,
    status: statusMap,
    pendingCount,
    getPendingCount,
    getSessionStats,
    isOnline,
    lastFailReason,
    hasUnsynced,
    hasFailed,
  };
}
