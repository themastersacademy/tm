"use client";
import { Card, Stack, Typography, Box, Chip } from "@mui/material";
import Image from "next/image";
import {
  AccessTime,
  HelpOutline,
  EmojiEvents,
  Lock,
  East,
} from "@mui/icons-material";

export default function ExamCard({
  title,
  icon,
  duration, // in minutes
  totalQuestions,
  totalMarks,
  difficulty = "medium", // easy, medium, hard
  status = "upcoming", // upcoming, live, completed
  isPro = false,
  actionButton,
  score = null,
}) {
  // Difficulty config
  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "#4CAF50";
      case "medium":
        return "#FF9800";
      case "hard":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  // Status config
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "live":
        return { color: "#F44336", label: "LIVE", bg: "#FFEBEE", border: "#F4433630" };
      case "completed":
        return { color: "#4CAF50", label: "Completed", bg: "#E8F5E9", border: "#4CAF5030" };
      default:
        return {
          color: "var(--primary-color)",
          label: "Upcoming",
          bg: "rgba(24, 113, 99, 0.08)",
          border: "rgba(24, 113, 99, 0.15)",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card
      sx={{
        width: "100%",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all 0.15s ease",
        cursor: "pointer",
        position: "relative",
        bgcolor: "white",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
      elevation={0}
    >
      {/* Header: Icon & Badges */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box
          sx={{
            width: "36px",
            height: "36px",
            backgroundColor: "rgba(24, 113, 99, 0.08)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgba(24, 113, 99, 0.15)",
            flexShrink: 0,
          }}
        >
          <Image src={icon} alt="icon" width={18} height={18} />
        </Box>

        <Stack direction="row" gap="6px">
          {isPro && (
            <Chip
              icon={<Lock sx={{ fontSize: "12px !important" }} />}
              label="PRO"
              size="small"
              sx={{
                height: "20px",
                fontSize: "10px",
                fontWeight: 700,
                backgroundColor: "#FFF3E0",
                color: "#E65100",
                border: "1px solid #E6510030",
                "& .MuiChip-icon": { color: "#E65100" },
                "& .MuiChip-label": { padding: "0 6px" },
              }}
            />
          )}
          <Chip
            label={statusConfig.label}
            size="small"
            sx={{
              height: "20px",
              fontSize: "10px",
              fontWeight: 700,
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.border}`,
              "& .MuiChip-label": { padding: "0 6px" },
            }}
          />
        </Stack>
      </Stack>

      {/* Title */}
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text1)",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </Typography>

      {/* Metadata Grid */}
      <Stack
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          backgroundColor: "rgba(24, 113, 99, 0.04)",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid rgba(24, 113, 99, 0.08)",
        }}
      >
        <Stack direction="row" alignItems="center" gap="6px">
          <AccessTime sx={{ fontSize: 14, color: "var(--text4)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
            }}
          >
            {duration ? `${duration} min` : "N/A"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="6px">
          <HelpOutline sx={{ fontSize: 14, color: "var(--text4)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
            }}
          >
            {totalQuestions ? `${totalQuestions} Qs` : "N/A"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="6px">
          <EmojiEvents sx={{ fontSize: 14, color: "var(--text4)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
            }}
          >
            {totalMarks ? `${totalMarks} Marks` : "N/A"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="6px">
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: getDifficultyColor(difficulty),
            }}
          />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
              textTransform: "capitalize",
            }}
          >
            {difficulty || "Medium"}
          </Typography>
        </Stack>
      </Stack>

      {/* Footer: Score or Action */}
      <Stack sx={{ marginTop: "auto" }}>
        {score !== null ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "var(--text4)",
              }}
            >
              Your Score
            </Typography>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: "var(--primary-color)",
              }}
            >
              {score}/{totalMarks}
            </Typography>
          </Stack>
        ) : (
          actionButton
        )}
      </Stack>
    </Card>
  );
}
