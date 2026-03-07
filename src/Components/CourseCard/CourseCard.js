"use client";
import { memo } from "react";
import { Stack, Typography, Box, LinearProgress } from "@mui/material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import {
  WorkspacePremium,
  SignalCellularAlt,
  Person,
} from "@mui/icons-material";

const CourseCard = memo(function CourseCard({
  title = "Untitled Course",
  thumbnail,
  Language = [],
  lessons = "0 Lessons",
  hours = "0 Hours",
  actionButton = null,
  actionMobile = null,
  isPro = false,
  isFree = false,
  progress = 0,
  instructor = null,
  difficulty = null,
  enrolledCount = null,
}) {
  const imageSrc = thumbnail || defaultThumbnail.src;
  const badgeText = isPro ? "PRO" : isFree ? "FREE" : null;

  // Difficulty badge config
  const getDifficultyConfig = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return { color: "#4CAF50", label: "Beginner", icon: 1 };
      case "intermediate":
        return { color: "#FF9800", label: "Intermediate", icon: 2 };
      case "advanced":
        return { color: "#F44336", label: "Advanced", icon: 3 };
      default:
        return null;
    }
  };

  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <Stack
      sx={{
        width: "100%",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        transition: "all 0.15s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
    >
      {/* Thumbnail Section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "140px", sm: "160px" },
          overflow: "hidden",
          backgroundColor: "#F1F5F9",
        }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          style={{
            objectFit: "cover",
          }}
        />

        {/* Progress Bar Overlay */}
        {progress > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
              padding: "8px 12px",
            }}
          >
            <Stack direction="row" alignItems="center" gap="8px">
              <Typography
                sx={{
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 600,
                  minWidth: "35px",
                }}
              >
                {progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  flex: 1,
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: "rgba(255,255,255,0.3)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4CAF50",
                    borderRadius: "3px",
                  },
                }}
              />
            </Stack>
          </Box>
        )}

        {/* Badge */}
        {badgeText && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: isPro
                ? "linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)"
                : "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isPro && <WorkspacePremium sx={{ fontSize: 16 }} />}
            {badgeText}
          </Box>
        )}

        {/* Difficulty Badge */}
        {difficultyConfig && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              backgroundColor: difficultyConfig.color,
              color: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <SignalCellularAlt sx={{ fontSize: 14 }} />
            {difficultyConfig.label}
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Stack padding="14px 16px" gap="12px">
        {/* Title */}
        <Typography
          sx={{
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </Typography>

        {/* Instructor Info */}
        {instructor && (
          <Stack direction="row" alignItems="center" gap="8px">
            <Person
              sx={{
                fontSize: 16,
                color: "var(--text3)",
              }}
            />
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--text3)",
                fontWeight: 500,
              }}
            >
              {instructor}
            </Typography>
          </Stack>
        )}

        {/* Language Tags */}
        {Language.length > 0 && (
          <Stack direction="row" gap="8px" flexWrap="wrap">
            {Language.map((lang, idx) => (
              <Box
                key={idx}
                sx={{
                  backgroundColor: "var(--sec-color-acc-2)",
                  color: "var(--sec-color)",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {lang}
              </Box>
            ))}
          </Stack>
        )}

        {/* Stats */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            paddingTop: "10px",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <Stack direction="row" gap="12px">
            <Stack direction="row" alignItems="center" gap="6px">
              <PlayLessonIcon
                sx={{ fontSize: 16, color: "var(--primary-color)" }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text2)",
                }}
              >
                {lessons}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap="6px">
              <AccessTimeFilledIcon
                sx={{ fontSize: 16, color: "var(--primary-color)" }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text2)",
                }}
              >
                {hours}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Enrollment Count */}
        {enrolledCount && (
          <Typography
            sx={{
              fontSize: "12px",
              color: "var(--text3)",
              fontWeight: 500,
            }}
          >
            {enrolledCount} students enrolled
          </Typography>
        )}

        {/* Desktop Action Button */}
        {actionButton && (
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              marginTop: "8px",
            }}
          >
            {actionButton}
          </Box>
        )}
      </Stack>

      {/* Mobile Action Button */}
      {actionMobile && (
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            borderTop: "1px solid var(--border-color)",
          }}
        >
          {actionMobile}
        </Box>
      )}
    </Stack>
  );
});

export default CourseCard;
