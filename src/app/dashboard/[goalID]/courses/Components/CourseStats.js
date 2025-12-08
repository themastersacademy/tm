"use client";
import { Stack, Typography, Box, LinearProgress } from "@mui/material";
import {
  School,
  CheckCircle,
  PlayCircle,
  TrendingUp,
} from "@mui/icons-material";

export default function CourseStats({ enrolledCourses = [] }) {
  // Calculate statistics
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;
  const notStartedCourses = enrolledCourses.filter(
    (course) => !course.progress || course.progress === 0
  ).length;

  const avgProgress =
    totalCourses > 0
      ? enrolledCourses.reduce(
          (sum, course) => sum + (course.progress || 0),
          0
        ) / totalCourses
      : 0;

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: School,
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      label: "Completed",
      value: completedCourses,
      icon: CheckCircle,
      color: "#4CAF50",
      bgColor: "#E8F5E9",
    },
    {
      label: "In Progress",
      value: inProgressCourses,
      icon: PlayCircle,
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
    {
      label: "Average Progress",
      value: `${Math.round(avgProgress)}%`,
      icon: TrendingUp,
      color: "#9C27B0",
      bgColor: "#F3E5F5",
      showProgress: true,
      progressValue: avgProgress,
    },
  ];

  if (totalCourses === 0) return null;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      gap="16px"
      sx={{
        width: "100%",
        marginBottom: "24px",
      }}
    >
      {stats.map((stat, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            padding: "20px",
            backgroundColor: "var(--white)",
            borderRadius: "16px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              borderColor: stat.color,
            },
          }}
        >
          <Stack gap="12px">
            {/* Icon and Label */}
            <Stack direction="row" alignItems="center" gap="12px">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  backgroundColor: stat.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <stat.icon sx={{ fontSize: 24, color: stat.color }} />
              </Box>
              <Stack flex={1}>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text3)",
                    lineHeight: 1.2,
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--text1)",
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </Typography>
              </Stack>
            </Stack>

            {/* Progress Bar for Average Progress */}
            {stat.showProgress && (
              <LinearProgress
                variant="determinate"
                value={stat.progressValue}
                sx={{
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: stat.bgColor,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: stat.color,
                    borderRadius: "4px",
                  },
                }}
              />
            )}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
