import { Card, Stack, Typography, Box } from "@mui/material";
import Image from "next/image";

export default function PrimaryCard({
  icon,
  title,
  subtitle,
  actionButton,
  enrolled,
  badge = null,
}) {
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "280px" },
        minHeight: "220px",
        border: enrolled
          ? "2px solid var(--primary-color)"
          : "1px solid var(--border-color)",
        padding: "24px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          borderColor: "var(--primary-color)",
        },
      }}
      elevation={0}
    >
      {/* Badge (difficulty/duration) */}
      {badge && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "var(--primary-color)",
            color: "white",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {badge}
        </Box>
      )}

      <Stack alignItems="center" gap="12px" flex={1}>
        {/* Icon */}
        <Box
          sx={{
            width: "80px",
            height: "80px",
            background:
              "linear-gradient(135deg, var(--sec-color-acc-2) 0%, var(--sec-color-acc-1) 100%)",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Image src={icon} alt="icon" width={36} height={36} />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--text3)",
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>

      {/* Action Button */}
      <Stack sx={{ marginTop: "auto", width: "100%" }}>{actionButton}</Stack>
    </Card>
  );
}
