"use client";
import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import appImage from "@/public/images/hero_landing.png"; // Placeholder
import playStore from "@/public/images/hero_landing.png"; // Placeholder
import appStore from "@/public/images/hero_landing.png"; // Placeholder

export default function AppDownload() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "var(--white)" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#FFF6F0",
            borderRadius: "32px",
            p: { xs: 4, md: 8 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="space-between"
            gap={6}
          >
            {/* Text Content */}
            <Stack gap={3} sx={{ width: { xs: "100%", md: "50%" }, zIndex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "28px", md: "40px" },
                  fontWeight: 900,
                  color: "var(--text1)",
                  lineHeight: 1.2,
                }}
              >
                Don&apos;t Wait to Grow – Login to Our App and Start Learning!
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "16px",
                  color: "var(--text3)",
                  lineHeight: 1.6,
                }}
              >
                Download our app to access courses, track your progress, and
                learn on the go. Available on iOS and Android.
              </Typography>

              <Stack direction="row" gap={2}>
                <Box
                  sx={{
                    width: "140px",
                    height: "45px",
                    position: "relative",
                    bgcolor: "black",
                    borderRadius: "8px",
                  }}
                >
                  {/* Placeholder for Play Store Button */}
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      textAlign: "center",
                      lineHeight: "45px",
                    }}
                  >
                    Google Play
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "140px",
                    height: "45px",
                    position: "relative",
                    bgcolor: "black",
                    borderRadius: "8px",
                  }}
                >
                  {/* Placeholder for App Store Button */}
                  <Typography
                    sx={{
                      color: "white",
                      fontSize: "12px",
                      textAlign: "center",
                      lineHeight: "45px",
                    }}
                  >
                    App Store
                  </Typography>
                </Box>
              </Stack>
            </Stack>

            {/* Phone Image Mockup */}
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ width: { xs: "100%", md: "45%" }, position: "relative" }}
            >
              <Box
                sx={{
                  width: "280px",
                  height: "500px",
                  bgcolor: "white",
                  borderRadius: "32px",
                  border: "8px solid #333",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src={appImage}
                  alt="App Screenshot"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </Box>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
