"use client";
// Route-segment error boundary. Catches any uncaught render or effect
// throw inside the exam page and renders a recovery UI instead of the
// browser's default "Application error" white screen.
//
// IMPORTANT: this is the last line of defense between a code bug and a
// student losing their exam attempt. Any unsynced answers are still in
// localStorage; the "Retry exam" button reloads the page, which re-mounts
// useExamSyncQueue, which hydrates and replays the queue.

import { useEffect } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function ExamErrorBoundary({ error, reset }) {
  useEffect(() => {
    // Surface the error so we see it in Vercel logs, with enough context
    // to triage which student / attempt was affected.
    console.error("[exam route error boundary]", {
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
      url: typeof window !== "undefined" ? window.location.href : "",
    });
  }, [error]);

  return (
    <Stack
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Box
        sx={{
          maxWidth: 520,
          padding: "24px 28px",
          borderRadius: "12px",
          border: "1px solid var(--border-color, #e0e0e0)",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#d32f2f", mb: 1 }}>
          Something went wrong loading the exam
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "var(--text2, #444)", mb: 1 }}>
          Your unsynced answers are saved on this device and will be sent to the
          server as soon as you're back in the exam. Click the button below to
          reload the page — your progress is not lost.
        </Typography>
        {error?.message ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: "var(--text4, #888)",
              fontFamily: "monospace",
              wordBreak: "break-word",
              mt: 1.5,
              mb: 2,
              padding: "8px 10px",
              backgroundColor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "6px",
            }}
          >
            {error.message}
          </Typography>
        ) : null}
        <Stack direction="row" gap="10px" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              try {
                reset();
              } catch {
                /* if reset itself throws, hard-reload */
                if (typeof window !== "undefined") window.location.reload();
              }
            }}
            sx={{
              backgroundColor: "var(--primary-color, #187163)",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              padding: "8px 22px",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "var(--primary-color-dark, #135548)" },
            }}
            disableElevation
          >
            Retry exam
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            sx={{
              borderColor: "var(--border-color, #ccc)",
              color: "var(--text2, #444)",
              textTransform: "none",
              fontWeight: 600,
              padding: "8px 22px",
              borderRadius: "8px",
            }}
          >
            Hard reload
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
