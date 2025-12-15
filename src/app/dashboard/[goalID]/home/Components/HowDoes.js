import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";

export default function HowDoes({ image, title, description, isLast }) {
  // Extract step number (e.g., "01. Enroll Course" -> "01")
  const stepNumber = title.split(".")[0];
  const cleanTitle = title.split(".").slice(1).join(".").trim();

  return (
    <Stack
      sx={{
        width: { xs: "100%", sm: "350px", md: "30%" },
        minHeight: "350px",
        borderRadius: "24px",
        backgroundColor: "var(--white)",
        padding: "40px 32px",
        gap: "24px",
        alignItems: "flex-start", // Left align
        position: "relative",
        border: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
        cursor: "default",
        boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          borderColor: "var(--primary-color)",
          "& .step-number": {
            color: "var(--primary-color)",
          },
        },
      }}
    >
      {/* Huge Step Number */}
      <Typography
        className="step-number"
        sx={{
          fontFamily: "Lato",
          fontSize: "48px",
          fontWeight: 900,
          color: "var(--sec-color-acc-1)", // Light orange initially
          lineHeight: 1,
          transition: "color 0.3s ease",
          mb: 1,
        }}
      >
        {stepNumber}
      </Typography>

      {/* Content */}
      <Stack gap="16px" alignItems="flex-start" textAlign="left">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--text1)",
          }}
        >
          {cleanTitle}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "16px",
            color: "var(--text3)",
            lineHeight: "1.6",
          }}
        >
          {description}
        </Typography>
      </Stack>

      {/* Bottom accent (optional visual from design) */}
      <Box
        sx={{
          mt: "auto",
          width: "40px",
          height: "4px",
          bgcolor: "var(--sec-color-acc-1)",
          borderRadius: "2px",
        }}
      />
    </Stack>
  );
}
