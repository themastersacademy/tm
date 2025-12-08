import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { WarningRounded, SecurityRounded } from "@mui/icons-material";

export default function ViolationDialog({
  open,
  onClose,
  count,
  maxCount = 3,
  title = "Security Alert",
  message,
}) {
  const isTerminal = count >= maxCount;
  const severity = isTerminal ? "error" : "warning";
  const color =
    severity === "error" ? "var(--delete-color)" : "var(--sec-color)";
  const bgColor =
    severity === "error" ? "var(--delete-color-acc-2)" : "#fff3e0";

  return (
    <Dialog
      open={open}
      onClose={isTerminal ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header Stripe */}
      <Box sx={{ height: "6px", bgcolor: color, width: "100%" }} />

      <DialogContent sx={{ p: 3, textAlign: "center" }}>
        <Stack alignItems="center" gap={2}>
          {/* Icon */}
          <Box
            sx={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              bgcolor: bgColor,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            {isTerminal ? (
              <SecurityRounded sx={{ fontSize: 32 }} />
            ) : (
              <WarningRounded sx={{ fontSize: 32 }} />
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "var(--text1)" }}
          >
            {isTerminal ? "Exam Terminated" : title}
          </Typography>

          {/* Message */}
          <Typography variant="body1" sx={{ color: "var(--text2)" }}>
            {message}
          </Typography>

          {/* Strike Indicator */}
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              bgcolor: "var(--bg-color)",
              px: 2,
              py: 1,
              borderRadius: "8px",
              mt: 1,
            }}
          >
            <Typography
              variant="subtitle2"
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
                    height: "6px",
                    borderRadius: "3px",
                    bgcolor: i < count ? color : "var(--border-color)",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{
            bgcolor: color,
            "&:hover": { bgcolor: color, filter: "brightness(0.9)" },
            borderRadius: "10px",
            height: "48px",
            fontWeight: 700,
            textTransform: "none",
            fontSize: "16px",
          }}
        >
          {isTerminal ? "Close & Submit" : "I Understand"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
