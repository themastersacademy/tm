"use client";
import { Card, Skeleton, Stack, Typography, Box } from "@mui/material";

export default function SecondaryCard({
  icon,
  title,
  subTitle,
  cardWidth,
  onClick,
  button,
}) {
  return (
    <Card
      sx={{
        width: cardWidth || "300px",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "14px 16px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.15s ease",
        "&:hover": onClick
          ? {
              borderColor: "var(--primary-color)",
            }
          : {},
      }}
      elevation={0}
      onClick={onClick}
    >
      <Stack direction="row" gap="12px" alignItems="center">
        {/* Icon */}
        <Box
          sx={{
            minWidth: "40px",
            height: "40px",
            backgroundColor: "rgba(24, 113, 99, 0.08)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid rgba(24, 113, 99, 0.15)",
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Stack gap="4px" flex={1}>
          <Typography
            component="div"
            sx={{
              color: "var(--text1)",
              fontSize: "14px",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {title || <Skeleton variant="text" width={100} height={20} />}
          </Typography>
          {subTitle && (
            <Typography
              component="div"
              sx={{
                color: "var(--text3)",
                fontSize: "12px",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {subTitle}
            </Typography>
          )}
        </Stack>

        {/* Button */}
        {button && (
          <Stack alignItems="center" justifyContent="center">
            {button}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
