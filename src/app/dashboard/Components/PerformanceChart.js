"use client";
import { Stack, Typography, Box } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export default function PerformanceChart({ data = [] }) {
  // Sample data structure: [{ label: "Mon", value: 30 }, { label: "Tue", value: 45 }, ...]
  const sampleData =
    data.length > 0
      ? data
      : [
          { label: "Mon", value: 30 },
          { label: "Tue", value: 45 },
          { label: "Wed", value: 60 },
          { label: "Thu", value: 35 },
          { label: "Fri", value: 70 },
          { label: "Sat", value: 50 },
          { label: "Sun", value: 40 },
        ];

  const maxValue = Math.max(...sampleData.map((d) => d.value), 100);

  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        backgroundColor: "var(--white)",
        padding: "24px",
        gap: "20px",
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap="8px">
          <TrendingUp sx={{ color: "var(--primary-color)", fontSize: 24 }} />
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text1)",
            }}
          >
            Weekly Activity
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text3)",
          }}
        >
          Study mins
        </Typography>
      </Stack>

      {/* Chart */}
      <Stack direction="row" alignItems="flex-end" gap="8px" height="160px">
        {sampleData.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100;

          return (
            <Stack
              key={index}
              flex={1}
              alignItems="center"
              gap="8px"
              sx={{
                transition: "all 0.3s ease",
                "&:hover .bar": {
                  opacity: 0.8,
                },
              }}
            >
              {/* Bar */}
              <Box
                className="bar"
                sx={{
                  width: "100%",
                  height: `${heightPercent}%`,
                  background:
                    "linear-gradient(180deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
                  borderRadius: "8px 8px 0 0",
                  minHeight: "20px",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  paddingTop: "8px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>

              {/* Label */}
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text3)",
                }}
              >
                {item.label}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      {/* Footer */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          paddingTop: "16px",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <Typography sx={{ fontSize: "13px", color: "var(--text3)" }}>
          Total this week
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--primary-color)",
          }}
        >
          {sampleData.reduce((sum, item) => sum + item.value, 0)} mins
        </Typography>
      </Stack>
    </Stack>
  );
}
