"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import featureImage from "@/public/images/hero_landing.png"; // Placeholder

export default function FeaturesSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#FFF6F0" }}>
      {" "}
      {/* Light orange background */}
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={8}
        >
          {/* Text Content */}
          <Stack gap={4} sx={{ width: { xs: "100%", md: "45%" } }}>
            <Stack gap={2}>
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
                Features
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "32px", md: "46px" },
                  fontWeight: 900,
                  color: "var(--text1)",
                  lineHeight: 1.2,
                }}
              >
                Watch, Practice, Smart – Anytime, Anywhere.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "16px",
                  color: "var(--text3)",
                  lineHeight: 1.6,
                }}
              >
                Our platform allows you to learn at your own pace, with
                unlimited re-watches of lectures and rigorous practice sessions.
              </Typography>
            </Stack>

            <Stack direction="row" gap={4}>
              <Stack gap={1}>
                <Stack
                  sx={{
                    width: "50px",
                    height: "50px",
                    bgcolor: "#FFE0B2",
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "var(--primary-color)",
                      borderRadius: "4px",
                    }}
                  />
                </Stack>
                <Typography
                  sx={{ fontFamily: "Lato", fontWeight: 700, fontSize: "16px" }}
                >
                  Live Classes
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    color: "var(--text3)",
                  }}
                >
                  Interactive sessions with expert teachers.
                </Typography>
              </Stack>
              <Stack gap={1}>
                <Stack
                  sx={{
                    width: "50px",
                    height: "50px",
                    bgcolor: "#FFE0B2",
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "var(--primary-color)",
                      borderRadius: "4px",
                    }}
                  />
                </Stack>
                <Typography
                  sx={{ fontFamily: "Lato", fontWeight: 700, fontSize: "16px" }}
                >
                  Mock Tests
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    color: "var(--text3)",
                  }}
                >
                  Evaluate your progress regularly.
                </Typography>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              sx={{
                width: "fit-content",
                mt: 2,
                borderRadius: "50px",
                textTransform: "none",
                bgcolor: "var(--primary-color)",
                px: 4,
                py: 1.5,
                fontSize: "16px",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
              }}
            >
              Learn More
            </Button>
          </Stack>

          {/* Image Composition */}
          <Stack
            sx={{ width: { xs: "100%", md: "50%" }, position: "relative" }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: "350px", md: "500px" },
                position: "relative",
              }}
            >
              <Image
                src={featureImage}
                alt="Features"
                fill
                style={{ objectFit: "contain" }}
              />

              {/* Floating UI Elements (Mockups) */}
              <Box
                sx={{
                  position: "absolute",
                  top: "10%",
                  right: "0",
                  width: "180px",
                  height: "220px",
                  bgcolor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  zIndex: 2,
                  display: { xs: "none", md: "block" },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: "0",
                  width: "200px",
                  height: "140px",
                  bgcolor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  zIndex: 2,
                  display: { xs: "none", md: "block" },
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
