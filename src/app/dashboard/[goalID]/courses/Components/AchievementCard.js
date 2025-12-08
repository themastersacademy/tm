"use client";
import { Stack, Typography, Box, LinearProgress } from "@mui/material";
import {
  EmojiEvents,
  CheckCircle,
  LocalFireDepartment,
} from "@mui/icons-material";

export default function AchievementCard({ enrolledCourses = [] }) {
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (course) => course.progress === 100
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;

  // Calculate completion percentage
  const completionRate =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  // Determine achievement level
  const getAchievementLevel = () => {
    if (completedCourses >= 10)
      return { title: "Master Learner", icon: "🏆", color: "#FFD700" };
    if (completedCourses >= 5)
      return { title: "Advanced Student", icon: "🌟", color: "#FF9800" };
    if (completedCourses >= 2)
      return { title: "Rising Star", icon: "⭐", color: "#4CAF50" };
    if (completedCourses >= 1)
      return { title: "First Step", icon: "🎯", color: "#2196F3" };
    return { title: "Getting Started", icon: "🚀", color: "#9C27B0" };
  };

  const achievement = getAchievementLevel();

  if (totalCourses === 0) return null;

  return (
    <Box
      sx={{
        width: "100%",
        padding: "24px",
        background: `linear-gradient(135deg, ${achievement.color}15 0%, ${achievement.color}05 100%)`,
        borderRadius: "16px",
        border: `2px solid ${achievement.color}40`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: `${achievement.color}10`,
        }}
      />

      <Stack gap="20px" position="relative" zIndex={1}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${achievement.color} 0%, ${achievement.color}CC 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${achievement.color}40`,
              }}
            >
              <EmojiEvents sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "var(--text3)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Your Achievement
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {achievement.title}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Stats Grid */}
        <Stack direction="row" gap="16px" flexWrap="wrap">
          <Box
            sx={{
              flex: 1,
              minWidth: "120px",
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <Stack gap="8px">
              <Stack direction="row" alignItems="center" gap="6px">
                <CheckCircle sx={{ fontSize: 18, color: "#4CAF50" }} />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    fontWeight: 600,
                  }}
                >
                  Completed
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {completedCourses}
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              minWidth: "120px",
              padding: "16px",
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid var(--border-color)",
            }}
          >
            <Stack gap="8px">
              <Stack direction="row" alignItems="center" gap="6px">
                <LocalFireDepartment sx={{ fontSize: 18, color: "#FF9800" }} />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    fontWeight: 600,
                  }}
                >
                  In Progress
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {inProgressCourses}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Progress to Next Level */}
        <Stack gap="8px">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--text2)",
                fontWeight: 600,
              }}
            >
              Overall Completion Rate
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: achievement.color,
                fontWeight: 700,
              }}
            >
              {completionRate}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            sx={{
              height: "10px",
              borderRadius: "5px",
              backgroundColor: `${achievement.color}20`,
              "& .MuiLinearProgress-bar": {
                backgroundColor: achievement.color,
                borderRadius: "5px",
              },
            }}
          />
        </Stack>

        {/* Motivational Message */}
        {completedCourses > 0 && (
          <Typography
            sx={{
              fontSize: "13px",
              color: "var(--text2)",
              fontStyle: "italic",
              textAlign: "center",
              padding: "12px",
              backgroundColor: "white",
              borderRadius: "8px",
            }}
          >
            {completedCourses === 1 && "Great start! Keep up the momentum."}
            {completedCourses >= 2 &&
              completedCourses < 5 &&
              "You're making excellent progress!"}
            {completedCourses >= 5 &&
              completedCourses < 10 &&
              "Impressive dedication! You're a true learner."}
            {completedCourses >= 10 &&
              "Outstanding! You're a learning champion!"}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
