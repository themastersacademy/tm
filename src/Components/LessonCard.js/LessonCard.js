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
        width: { xs: "100%", sm: "100%", md: "100%", lg: "350px" },
        maxWidth: { xs: "100%", sm: "100%", md: "100%", lg: "350px" },
        maxHeight: "70px",
        height: "70px",
        padding: "10px",
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
        <Typography sx={{ fontFamily: "Lato", fontSize: "16px" }}>
          {LessonName}
        </Typography>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "12px", color: "var(--text3)" }}
        >
          {duration}
        </Typography>
      </Stack>
      <Stack sx={{ marginLeft: "auto" }}>{iconEnd}</Stack>
    </Stack>
  );
}
