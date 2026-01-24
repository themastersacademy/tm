"use client";
import React from "react";
import { Box, Typography, Button, Container, Stack, Grid } from "@mui/material";
import dashboard from "@/public/image/Dashboard.svg";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Login = () => {
  const benefits = [
    "Track your daily progress & stats",
    "Access 500+ premium video courses",
    "Get personalized mentor feedback",
    "Participate in weekly scholarship tests",
  ];

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 6, md: 10 },
        mb: { xs: 6, md: 10 },
        scrollMarginTop: "10vh",
      }}
    >
      <Box
        sx={{
          bgcolor: "#051e1a", // Deep Teal
          borderRadius: { xs: "24px", md: "40px" },
          overflow: "hidden",
          position: "relative",
          p: { xs: 4, md: 6 }, // Tighter padding
        }}
      >
        {/* Decorative Gradients */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(24,113,99,0.3) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(254, 194, 77, 0.1) 0%, rgba(0,0,0,0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <Grid
          container
          spacing={{ xs: 4, md: 5 }}
          alignItems="center"
          position="relative"
          zIndex={1}
        >
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontFamily: "var(--font-satoshi)",
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "13px",
                color: "var(--secondary)",
                mb: 1.5,
                textTransform: "uppercase",
                display: "inline-block",
                px: 2,
                py: 0.5,
                bgcolor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "50px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Student Portal
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-helvetica)",
                fontWeight: 700,
                fontSize: { xs: "28px", sm: "36px", md: "48px" },
                color: "#fff",
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Ready to Accelerate Your{" "}
              <span style={{ color: "var(--secondary)" }}>Growth?</span>
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-satoshi)",
                fontSize: { xs: "15px", md: "16px" },
                color: "rgba(255,255,255,0.7)",
                mb: 3,
                maxWidth: "95%",
              }}
            >
              Login to our centralized Learning Management System (LMS) to
              access your courses, track assignments, and connect with mentors
              in real-time.
            </Typography>

            <Stack gap={1.5} mb={4}>
              {benefits.map((benefit, index) => (
                <Stack
                  key={index}
                  direction="row"
                  gap={1.5}
                  alignItems="center"
                >
                  <CheckCircleIcon
                    sx={{ color: "var(--secondary)", fontSize: 20 }}
                  />
                  <Typography
                    sx={{
                      color: "#fff",
                      fontFamily: "var(--font-satoshi)",
                      fontSize: "15px",
                    }}
                  >
                    {benefit}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Button
              variant="contained"
              href="/signIn"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: "50px",
                bgcolor: "var(--secondary)",
                fontSize: "16px",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                textTransform: "none",
                color: "#000",
                boxShadow: "0 8px 20px rgba(254, 194, 77, 0.2)",
                fontFamily: "var(--font-satoshi)",
                "&:hover": {
                  bgcolor: "#fff",
                },
              }}
            >
              Login to Dashboard
            </Button>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "280px", md: "400px" }, // Slightly reduced height
                borderRadius: "20px",
                overflow: "hidden",
                border: "8px solid rgba(255,255,255,0.1)",
                bgcolor: "#000",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              }}
            >
              <Image
                src={dashboard}
                alt="Dashboard Preview"
                fill
                style={{ objectFit: "cover", objectPosition: "top left" }}
              />
              {/* Glass Overlay Effect */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "80px",
                  background:
                    "linear-gradient(to top, rgba(5,30,26, 0.9), transparent)",
                  zIndex: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
