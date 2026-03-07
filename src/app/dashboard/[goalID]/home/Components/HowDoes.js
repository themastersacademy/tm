import { Stack, Typography, Box } from "@mui/material";

export default function HowDoes({ title, description }) {
  const stepNumber = title.split(".")[0];
  const cleanTitle = title.split(".").slice(1).join(".").trim();

  return (
    <Stack
      sx={{
        width: { xs: "100%", sm: "280px", md: "30%" },
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        padding: "20px",
        gap: "16px",
        alignItems: "flex-start",
        position: "relative",
        border: "1px solid var(--border-color)",
        transition: "all 0.15s ease",
        cursor: "default",
        "&:hover": {
          borderColor: "var(--primary-color)",
          "& .step-number": {
            color: "var(--primary-color)",
          },
        },
      }}
    >
      {/* Step Number */}
      <Typography
        className="step-number"
        sx={{
          fontFamily: "Lato",
          fontSize: "32px",
          fontWeight: 800,
          color: "var(--sec-color-acc-1)",
          lineHeight: 1,
          transition: "color 0.15s ease",
        }}
      >
        {stepNumber}
      </Typography>

      {/* Content */}
      <Stack gap="8px" alignItems="flex-start" textAlign="left">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "15px",
            fontWeight: 700,
            color: "var(--text1)",
          }}
        >
          {cleanTitle}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "13px",
            color: "var(--text3)",
            lineHeight: "1.5",
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Bottom accent */}
      <Box
        sx={{
          mt: "auto",
          width: "32px",
          height: "3px",
          bgcolor: "var(--sec-color-acc-1)",
          borderRadius: "2px",
        }}
      />
    </Stack>
  );
}
