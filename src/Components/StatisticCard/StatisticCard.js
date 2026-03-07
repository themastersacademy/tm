import { Card, Stack, Typography, Box } from "@mui/material";
import Image from "next/image";

export default function StatisticCard({ icon, title, count, trend = null }) {
  return (
    <Card
      sx={{
        padding: "14px 16px",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        transition: "all 0.15s ease",
        cursor: "default",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
      elevation={0}
    >
      <Stack gap="12px">
        {/* Icon and Title */}
        <Stack direction="row" alignItems="center" gap="10px">
          <Box
            sx={{
              backgroundColor: "rgba(24, 113, 99, 0.08)",
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid rgba(24, 113, 99, 0.15)",
            }}
          >
            <Image src={icon} alt="icon" width={18} height={18} />
          </Box>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text3)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Stack>

        {/* Count */}
        <Stack direction="row" alignItems="baseline" gap="8px">
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text1)",
              lineHeight: 1,
            }}
          >
            {count || 0}
          </Typography>

          {/* Trend Badge (optional) */}
          {trend && (
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: trend > 0 ? "#4CAF50" : "#F44336",
                backgroundColor: trend > 0 ? "#E8F5E9" : "#FFEBEE",
                padding: "2px 6px",
                borderRadius: "6px",
              }}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </Typography>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
