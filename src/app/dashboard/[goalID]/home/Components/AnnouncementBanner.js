"use client";
import { useState, useEffect } from "react";
import { Stack, Typography, Box, IconButton, Alert } from "@mui/material";
import { Info, Warning, CheckCircle, Error, Close } from "@mui/icons-material";

export default function AnnouncementBanner({ announcements }) {
  const [dismissedIds, setDismissedIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load dismissed announcements from localStorage
  useEffect(() => {
    const dismissed = JSON.parse(
      localStorage.getItem("dismissedAnnouncements") || "[]"
    );
    setDismissedIds(dismissed);
  }, []);

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (a) => !dismissedIds.includes(a.announcementID)
  );

  // Auto-carousel if multiple
  useEffect(() => {
    if (visibleAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [visibleAnnouncements.length]);

  const handleDismiss = (announcementID) => {
    const newDismissed = [...dismissedIds, announcementID];
    setDismissedIds(newDismissed);
    localStorage.setItem(
      "dismissedAnnouncements",
      JSON.stringify(newDismissed)
    );

    // Reset index if needed
    if (currentIndex >= visibleAnnouncements.length - 1) {
      setCurrentIndex(0);
    }
  };

  if (visibleAnnouncements.length === 0) return null;

  const currentAnnouncement = visibleAnnouncements[currentIndex];

  const getTypeConfig = (type) => {
    switch (type) {
      case "info":
        return {
          icon: <Info />,
          color: "#2196F3",
          bgColor: "#E3F2FD",
        };
      case "warning":
        return {
          icon: <Warning />,
          color: "#FF9800",
          bgColor: "#FFF3E0",
        };
      case "success":
        return {
          icon: <CheckCircle />,
          color: "#4CAF50",
          bgColor: "#E8F5E9",
        };
      case "error":
        return {
          icon: <Error />,
          color: "#F44336",
          bgColor: "#FFEBEE",
        };
      default:
        return {
          icon: <Info />,
          color: "#2196F3",
          bgColor: "#E3F2FD",
        };
    }
  };

  const config = getTypeConfig(currentAnnouncement.type);

  return (
    <Box
      sx={{
        backgroundColor: config.bgColor,
        borderLeft: `4px solid ${config.color}`,
        borderRadius: "12px",
        padding: "16px 20px",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Stack direction="row" gap="16px" alignItems="flex-start">
        {/* Icon */}
        <Box
          sx={{
            color: config.color,
            display: "flex",
            alignItems: "center",
            fontSize: "24px",
          }}
        >
          {config.icon}
        </Box>

        {/* Content */}
        <Stack flex={1} gap="4px">
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: config.color,
            }}
          >
            {currentAnnouncement.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "var(--text2)",
              lineHeight: 1.5,
            }}
          >
            {currentAnnouncement.message}
          </Typography>
        </Stack>

        {/* Dismiss button */}
        <IconButton
          onClick={() => handleDismiss(currentAnnouncement.announcementID)}
          sx={{
            color: config.color,
            padding: "4px",
          }}
        >
          <Close />
        </IconButton>
      </Stack>

      {/* Carousel indicators */}
      {visibleAnnouncements.length > 1 && (
        <Stack
          direction="row"
          gap="6px"
          justifyContent="center"
          sx={{ marginTop: "12px" }}
        >
          {visibleAnnouncements.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === currentIndex ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor:
                  index === currentIndex ? config.color : "rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
