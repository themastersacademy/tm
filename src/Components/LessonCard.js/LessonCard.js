import { Stack, Typography } from "@mui/material";

export default function LessonCard({
  iconStart,
  iconEnd,
  LessonName,
  duration,
  now,
  isPreview,
  onClick,
  isEnrolled,
  isSelected,
}) {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      sx={{
        width: "100%",
        minHeight: "60px",
        padding: "10px 12px",
        backgroundColor: isSelected
          ? "var(--sec-color-acc-1)"
          : now && !isSelected
          ? "var(--sec-color-acc-1)"
          : "var(--white)",
        borderRadius: "8px",
        gap: "12px",
        cursor: isPreview || isEnrolled ? "pointer" : "not-allowed",
      }}
      onClick={onClick}
    >
      {iconStart}
      <Stack gap="2px">
        <Typography sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: 500 }}>
          {LessonName}
        </Typography>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "11px", color: "var(--text3)" }}
        >
          {duration}
        </Typography>
      </Stack>
      <Stack sx={{ marginLeft: "auto" }}>{iconEnd}</Stack>
    </Stack>
  );
}
