"use client";
import { useState, useEffect } from "react";
import { Stack, Typography, Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Lightbulb } from "@mui/icons-material";

export default function LearningTips() {
  const tips = [
    {
      title: "Set Daily Goals",
      description:
        "Dedicate at least 30 minutes each day to learning. Consistency is key to mastering new skills.",
    },
    {
      title: "Take Notes",
      description:
        "Write down important concepts and review them regularly to reinforce your learning.",
    },
    {
      title: "Practice Regularly",
      description:
        "Apply what you learn through exercises and projects. Practical application solidifies knowledge.",
    },
    {
      title: "Join Study Groups",
      description:
        "Connect with fellow learners to discuss topics, share insights, and stay motivated.",
    },
    {
      title: "Take Breaks",
      description:
        "Use the Pomodoro technique - study for 25 minutes, then take a 5-minute break to recharge.",
    },
  ];

  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <Box
      sx={{
        width: "100%",
        padding: "24px",
        background:
          "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.05)",
        }}
      />

      <Stack gap="16px" position="relative" zIndex={1}>
        {/* Header */}
        <Stack direction="row" alignItems="center" gap="12px">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lightbulb sx={{ fontSize: 24, color: "white" }} />
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "white",
            }}
          >
            Learning Tip
          </Typography>
        </Stack>

        {/* Tip Content */}
        <Stack gap="8px" minHeight="100px" justifyContent="center">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "white",
            }}
          >
            {tips[currentTip].title}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.6,
            }}
          >
            {tips[currentTip].description}
          </Typography>
        </Stack>

        {/* Navigation */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" gap="6px">
            {tips.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: currentTip === index ? 24 : 8,
                  height: 8,
                  borderRadius: "4px",
                  backgroundColor:
                    currentTip === index ? "white" : "rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => setCurrentTip(index)}
              />
            ))}
          </Stack>

          <Stack direction="row" gap="4px">
            <IconButton
              size="small"
              onClick={prevTip}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              size="small"
              onClick={nextTip}
              sx={{
                color: "white",
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
