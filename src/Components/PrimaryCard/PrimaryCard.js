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
        minHeight: "180px",
        border: enrolled
          ? "2px solid var(--primary-color)"
          : "1px solid var(--border-color)",
        padding: "16px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        transition: "all 0.15s ease",
        cursor: "pointer",
        "&:hover": {
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
            top: 10,
            right: 10,
            backgroundColor: "var(--primary-color)",
            color: "white",
            fontSize: "10px",
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {badge}
        </Box>
      )}

      <Stack alignItems="center" gap="10px" flex={1}>
        {/* Icon */}
        <Box
          sx={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(24, 113, 99, 0.08)",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgba(24, 113, 99, 0.15)",
          }}
        >
          <Image src={icon} alt="icon" width={24} height={24} />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            sx={{
              fontSize: "12px",
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
