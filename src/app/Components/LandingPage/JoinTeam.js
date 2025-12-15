"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import teamImage from "@/public/images/hero_landing.png"; // Placeholder

export default function JoinTeam() {
  const benefits = [
    "Expert instructors with years of industry experience.",
    "Interactive learning with live doubt clearing.",
    "Structured curriculum designed for success.",
  ];

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "var(--white)" }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          gap={8}
        >
          {/* Image Section */}
          <Stack
            sx={{ width: { xs: "100%", md: "50%" }, position: "relative" }}
          >
            {/* Decorative Background */}
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: "80%",
                height: "80%",
                borderRadius: "24px",
                bgcolor: "var(--sec-color-acc-1)",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", md: "450px" },
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <Image
                src={teamImage}
                alt="Join Our Team"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Stack>

          {/* Text Content */}
          <Stack gap={3} sx={{ width: { xs: "100%", md: "50%" } }}>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--primary-color)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Our Mission
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "32px", md: "42px" },
                fontWeight: 800,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              Join Our Team – Inspire Learners Today.
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
                color: "var(--text3)",
                lineHeight: 1.6,
              }}
            >
              Become a part of a community that is transforming education. Share
              your knowledge, mentor students, and help them achieve their goals
              while growing your own career.
            </Typography>

            <Stack gap={2}>
              {benefits.map((text, index) => (
                <Stack key={index} direction="row" gap={2} alignItems="start">
                  <CheckCircleIcon
                    sx={{ color: "var(--primary-color)", mt: 0.5 }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "16px",
                      color: "var(--text2)",
                      fontWeight: 500,
                    }}
                  >
                    {text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Button
              variant="contained"
              sx={{
                width: "fit-content",
                mt: 2,
                borderRadius: "50px",
                textTransform: "none",
                bgcolor: "var(--primary-color)",
                px: 5,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              }}
            >
              Join Now
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
