import { WarningRounded, SecurityRounded } from "@mui/icons-material";
import { Box, Stack, Typography, LinearProgress } from "@mui/material";
import React from "react";

export default function AntiCheatToast({ count, maxCount = 3, message }) {
  const severity = count >= maxCount ? "error" : "warning";
  const color =
    severity === "error" ? "var(--delete-color)" : "var(--sec-color)";
  const bgColor =
    severity === "error" ? "var(--delete-color-acc-2)" : "#fff3e0"; // Light orange for warning

  return (
    <Box
      sx={{
        minWidth: "300px",
        maxWidth: "400px",
        bgcolor: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
        border: `1px solid ${color}`,
        position: "relative",
      }}
    >
      {/* Accent Bar */}
      <Box sx={{ height: "4px", bgcolor: color, width: "100%" }} />

      <Stack direction="row" p={2} gap={2} alignItems="flex-start">
        {/* Icon */}
        <Box
          sx={{
            p: 1,
            borderRadius: "50%",
            bgcolor: bgColor,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {severity === "error" ? (
            <SecurityRounded sx={{ fontSize: 24 }} />
          ) : (
            <WarningRounded sx={{ fontSize: 24 }} />
          )}
        </Box>

        {/* Content */}
        <Stack gap={0.5} flex={1}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "var(--text1)", lineHeight: 1.2 }}
          >
            {severity === "error" ? "Exam Terminated" : "Security Alert"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--text3)", fontSize: "13px", lineHeight: 1.4 }}
          >
            {message}
          </Typography>

          {/* Strike Indicator */}
          <Stack direction="row" alignItems="center" gap={1} mt={1}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: color }}
            >
              Strike {count}/{maxCount}
            </Typography>
            <Stack direction="row" gap={0.5}>
              {[...Array(maxCount)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: "24px",
                    height: "4px",
                    borderRadius: "2px",
                    bgcolor: i < count ? color : "var(--border-color)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
