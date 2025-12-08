import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Cancel, Help, RemoveCircle } from "@mui/icons-material";

export default function Overview({ result }) {
  const stats = [
    {
      label: "Score",
      value: `${result?.obtainedMarks || 0}/${result?.totalMarks || 0}`,
      subValue: `${((result?.obtainedMarks / result?.totalMarks) * 100).toFixed(
        1
      )}%`,
      color: "var(--primary-color)",
      bgColor: "var(--primary-color-acc-2)",
      icon: (
        <CircularProgress
          variant="determinate"
          value={75}
          size={24}
          color="inherit"
        />
      ),
    },
    {
      label: "Correct",
      value: result?.totalCorrectAnswers || 0,
      color: "#2e7d32", // Green
      bgColor: "#e8f5e9",
      icon: <CheckCircle fontSize="small" color="inherit" />,
    },
    {
      label: "Incorrect",
      value: result?.totalWrongAnswers || 0,
      color: "#d32f2f", // Red
      bgColor: "#ffebee",
      icon: <Cancel fontSize="small" color="inherit" />,
    },
    {
      label: "Unanswered",
      value:
        result?.totalQuestions -
          (result?.totalSkippedAnswers + result?.totalAttemptedAnswers) || 0,
      color: "#ed6c02", // Orange
      bgColor: "#fff3e0",
      icon: <Help fontSize="small" color="inherit" />,
    },
    {
      label: "Skipped",
      value: result?.totalSkippedAnswers || 0,
      color: "#757575", // Grey
      bgColor: "#f5f5f5",
      icon: <RemoveCircle fontSize="small" color="inherit" />,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid var(--border-color)",
        bgcolor: "white",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        Performance Overview
      </Typography>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={4} md={2.4} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: stat.bgColor,
                color: stat.color,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ opacity: 0.9 }}
                >
                  {stat.label}
                </Typography>
                {stat.icon}
              </Stack>
              <Stack alignItems="baseline" gap={0.5}>
                <Typography variant="h5" fontWeight={700}>
                  {stat.value}
                </Typography>
                {stat.subValue && (
                  <Typography variant="caption" fontWeight={600}>
                    {stat.subValue}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
