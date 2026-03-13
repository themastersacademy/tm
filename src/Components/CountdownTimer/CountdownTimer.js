"use client";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function CountdownTimer({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetTime) - Date.now();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <Box
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "10px 14px",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Typography sx={{ fontSize: "11px", color: "var(--text2)", mb: 0.5 }}>
        Starts in
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--primary-color)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.02em",
        }}
      >
        {String(hours).padStart(2, "0")} hrs {String(minutes).padStart(2, "0")} min{" "}
        {String(seconds).padStart(2, "0")} sec
      </Typography>
    </Box>
  );
}
