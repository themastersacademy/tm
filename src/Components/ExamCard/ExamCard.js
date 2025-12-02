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
        return { color: "#F44336", label: "LIVE", bg: "#FFEBEE" };
      case "completed":
        return { color: "#4CAF50", label: "Completed", bg: "#E8F5E9" };
      default:
        return {
          color: "var(--primary-color)",
          label: "Upcoming",
          bg: "var(--sec-color-acc-2)",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card
      sx={{
        width: "100%",
        minHeight: "200px",
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        position: "relative",
        bgcolor: "white",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
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
            width: "56px",
            height: "56px",
            background:
              "linear-gradient(135deg, var(--sec-color-acc-2) 0%, var(--sec-color-acc-1) 100%)",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={icon} alt="icon" width={28} height={28} />
        </Box>

        <Stack direction="row" gap="8px">
          {isPro && (
            <Box
              sx={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "white",
                padding: "4px 8px",
                borderRadius: "8px",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              <Lock sx={{ fontSize: 12 }} /> PRO
            </Box>
          )}
          <Box
            sx={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.color,
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {statusConfig.label}
          </Box>
        </Stack>
      </Stack>

      {/* Title */}
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text1)",
          lineHeight: 1.4,
          minHeight: "44px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {title}
      </Typography>

      {/* Metadata Grid */}
      <Stack
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          backgroundColor: "#F8F9FA",
          padding: "12px",
          borderRadius: "12px",
        }}
      >
        <Stack direction="row" alignItems="center" gap="6px">
          <AccessTime sx={{ fontSize: 16, color: "var(--text3)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {duration ? `${duration} min` : "N/A"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="6px">
          <HelpOutline sx={{ fontSize: 16, color: "var(--text3)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {totalQuestions ? `${totalQuestions} Qs` : "N/A"}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="6px">
          <EmojiEvents sx={{ fontSize: 16, color: "var(--text3)" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text2)",
              fontFamily: "var(--font-geist-sans)",
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
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {difficulty || "Medium"}
          </Typography>
        </Stack>
      </Stack>

      {/* Footer: Score or Action */}
      <Stack sx={{ marginTop: "auto", paddingTop: "8px" }}>
        {score !== null ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--text3)",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              Your Score
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--primary-color)",
                fontFamily: "var(--font-geist-sans)",
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
