import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";

export default function HowDoes({ image, title, description }) {
  // Extract step number from title (e.g., "01. Enroll Course" -> "01")
  const stepNumber = title.split(".")[0];
  const cleanTitle = title.split(".").slice(1).join(".").trim();

  return (
    <Stack
      sx={{
        width: { xs: "100%", sm: "350px", md: "30%" },
        minHeight: "320px",
        borderRadius: "24px",
        backgroundColor: "var(--white)",
        padding: "32px 24px",
        gap: "24px",
        alignItems: "center",
        position: "relative",
        border: "1px solid var(--border-color)",
        transition: "all 0.3s ease",
        cursor: "default",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          borderColor: "var(--primary-color)",
          "& .step-badge": {
            backgroundColor: "var(--primary-color)",
            color: "white",
          },
        },
      }}
    >
      {/* Step Number Badge */}
      <Box
        className="step-badge"
        sx={{
          position: "absolute",
          top: "24px",
          right: "24px",
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          backgroundColor: "var(--sec-color-acc-1)",
          color: "var(--primary-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "800",
          fontSize: "14px",
          fontFamily: "Lato",
          transition: "all 0.3s ease",
        }}
      >
        {stepNumber}
      </Box>

      {/* Icon Container */}
      <Stack
        sx={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "var(--bg-color)",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <Image src={image} alt="icon" width={60} height={60} />
      </Stack>

      {/* Content */}
      <Stack gap="12px" alignItems="center" textAlign="center">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "20px",
            fontWeight: "800",
            color: "var(--text1)",
          }}
        >
          {cleanTitle}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "14px",
            color: "var(--text3)",
            lineHeight: "1.6",
            maxWidth: "280px",
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
