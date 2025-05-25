"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const usePreventNavigation = (shouldPrevent) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    if (!shouldPrevent) return;

    // 1️⃣ Handle browser tab/window closure (native prompt)
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2️⃣ Handle back/forward navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = (e) => {
      e.preventDefault();
      setTargetUrl(window.location.href);
      setIsInternal(false);
      setShowDialog(true);
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);

    // 3️⃣ Handle Next.js client-side navigation (anchor clicks)
    const handleAnchorClick = (e) => {
      if (e.button !== 0 || e.defaultPrevented) return;
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const isSameOrigin = anchor.origin === window.location.origin;
      if (!isSameOrigin || href === pathname + window.location.search) return;
      e.preventDefault();
      setTargetUrl(href);
      setIsInternal(true);
      setShowDialog(true);
    };
    document.addEventListener("click", handleAnchorClick);

    // 4️⃣ Block key shortcuts (F5, Ctrl+R, F12, DevTools, etc.)
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      // F12
      if (e.key === "F12") return e.preventDefault();
      // F5 or Ctrl+R / Cmd+R
      if (e.key === "f5" || ((e.ctrlKey || e.metaKey) && key === "r")) {
        e.preventDefault();
        setTargetUrl(window.location.href);
        setIsInternal(false);
        return setShowDialog(true);
      }
      // Ctrl+Shift+I/J/C
      if (e.ctrlKey && e.shiftKey && /[ijc]/.test(key))
        return e.preventDefault();
      // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
      if ((e.ctrlKey || e.metaKey) && /[usp]/.test(key))
        return e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);

    // 5️⃣ Disable text selection & context menu
    const disableEvent = (e) => e.preventDefault();
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
    document.addEventListener("contextmenu", disableEvent);
    document.addEventListener("selectstart", disableEvent);

    // Cleanup all listeners and restore defaults
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleAnchorClick);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      document.removeEventListener("contextmenu", disableEvent);
      document.removeEventListener("selectstart", disableEvent);
    };
  }, [shouldPrevent, pathname]);

  const confirmNavigation = () => {
    setShowDialog(false);
    if (isInternal) {
      router.push(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  };

  const cancelNavigation = () => {
    setShowDialog(false);
    setTargetUrl("");
    setIsInternal(false);
  };

  return { showDialog, confirmNavigation, cancelNavigation };
};
