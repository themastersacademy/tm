"use client";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import promoImage from "@/public/images/hero_landing.png"; // Placeholder

export default function PromotionalBanner() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            width: "100%",
            borderRadius: "32px",
            bgcolor: "#1E2A23", // Dark Greenish/Black from design
            background: "linear-gradient(135deg, #2D3A30 0%, #151C18 100%)",
            overflow: "hidden",
            position: "relative",
            p: { xs: 4, md: 8 },
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
                  fontSize: { xs: "28px", md: "36px" },
                  fontWeight: 800,
                  color: "white",
                  lineHeight: 1.3,
                }}
              >
                Secure Perfect Marks From Any Where, Not Affordable That Why Are
                We On Do Your Side.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "16px",
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1.6,
                }}
              >
                Join the fastest growing learning platform and take your skills
                to the next level.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  width: "fit-content",
                  borderRadius: "50px",
                  textTransform: "none",
                  bgcolor: "var(--primary-color)",
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: 700,
                }}
              >
                Start Learning
              </Button>
            </Stack>

            {/* Right Image/Mockup */}
            <Stack
              sx={{
                width: { xs: "100%", md: "45%" },
                position: "relative",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "250px", md: "300px" },
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "8px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Image
                  src={promoImage}
                  alt="Promo"
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
