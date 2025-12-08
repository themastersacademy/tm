import { Card, Stack, Typography, Box } from "@mui/material";
import Image from "next/image";

export default function StatisticCard({ icon, title, count, trend = null }) {
  return (
    <Card
      sx={{
        padding: "20px",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          borderColor: "var(--primary-color)",
        },
      }}
      elevation={0}
    >
      <Stack gap="16px">
        {/* Icon and Title */}
        <Stack direction="row" alignItems="center" gap="10px">
          <Box
            sx={{
              background:
                "linear-gradient(135deg, var(--sec-color-acc-2) 0%, var(--sec-color-acc-1) 100%)",
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Image src={icon} alt="icon" width={20} height={20} />
          </Box>

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text2)",
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
              fontSize: "32px",
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
                fontSize: "12px",
                fontWeight: 600,
                color: trend > 0 ? "#4CAF50" : "#F44336",
                backgroundColor: trend > 0 ? "#E8F5E9" : "#FFEBEE",
                padding: "2px 8px",
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
