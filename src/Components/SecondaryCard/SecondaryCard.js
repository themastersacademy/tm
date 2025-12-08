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
        borderRadius: "16px",
        padding: "20px",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": onClick
          ? {
              transform: "translateY(-4px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              borderColor: "var(--sec-color)",
            }
          : {},
      }}
      elevation={0}
      onClick={onClick}
    >
      <Stack direction="row" gap="16px" alignItems="center">
        {/* Icon with gradient background */}
        <Box
          sx={{
            minWidth: "64px",
            height: "64px",
            background:
              "linear-gradient(135deg, var(--sec-color-acc-2) 0%, var(--sec-color-acc-1) 100%)",
            borderRadius: "14px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {icon}
        </Box>

        {/* Content */}
        <Stack gap="6px" flex={1}>
          <Typography
            component="div"
            sx={{
              color: "var(--text1)",
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              lineHeight: 1.3,
              fontFamily: "var(--font-geist-sans)",
            }}
          >
            {title || <Skeleton variant="text" width={100} height={20} />}
          </Typography>
          {subTitle && (
            <Typography
              component="div"
              sx={{
                color: "var(--text3)",
                fontSize: "13px",
                fontWeight: 500,
                lineHeight: 1.4,
                fontFamily: "var(--font-geist-sans)",
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
