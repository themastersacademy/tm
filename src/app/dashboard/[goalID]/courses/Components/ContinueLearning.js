"use client";
import { Stack, Typography, Box, Button } from "@mui/material";
import { PlayArrow, AccessTime } from "@mui/icons-material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";

export default function ContinueLearning({ courses = [], onCourseClick }) {
  const inProgressCourses = courses
    .filter((course) => course.progress > 0 && course.progress < 100)
    .slice(0, 3);

  if (inProgressCourses.length === 0) return null;

  return (
    <Stack gap="16px" width="100%">
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text1)",
        }}
      >
        Continue Learning
      </Typography>

      <Stack direction="row" gap="16px" flexWrap="wrap">
        {inProgressCourses.map((course) => (
          <Box
            key={course.id}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 8px)",
                md: "1 1 calc(33.333% - 11px)",
              },
              maxWidth: {
                xs: "100%",
                sm: "calc(50% - 8px)",
                md: "calc(33.333% - 11px)",
              },
              backgroundColor: "var(--white)",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid var(--border-color)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                borderColor: "var(--primary-color)",
              },
            }}
            onClick={() => onCourseClick(course.id)}
          >
            {/* Thumbnail with Progress Overlay */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "160px",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Image
                src={course.thumbnail || defaultThumbnail.src}
                alt={course.title}
                fill
                style={{ objectFit: "cover" }}
              />

              {/* Progress Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "6px",
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              >
                <Box
                  sx={{
                    width: `${course.progress}%`,
                    height: "100%",
                    backgroundColor: "var(--primary-color)",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>

              {/* Progress Badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(8px)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {Math.round(course.progress)}% Complete
              </Box>
            </Box>

            {/* Content */}
            <Stack padding="16px" gap="12px">
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text1)",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "42px",
                }}
              >
                {course.title}
              </Typography>

              {course.lastWatched && (
                <Stack direction="row" alignItems="center" gap="6px">
                  <AccessTime sx={{ fontSize: 14, color: "var(--text3)" }} />
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "var(--text3)",
                    }}
                  >
                    Last watched {course.lastWatched}
                  </Typography>
                </Stack>
              )}

              <Button
                variant="contained"
                fullWidth
                startIcon={<PlayArrow />}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "10px",
                  padding: "10px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "var(--primary-color-dark)",
                  },
                }}
              >
                Resume Learning
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
