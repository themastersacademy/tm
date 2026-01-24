"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import iphone from "@/public/image/iPhone.png";
import Instructor from "@/public/image/Instructor.svg";
import Image from "next/image";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Your Free Account",
      color: "#564FFD",
      bg: "rgba(86, 79, 253, 0.1)",
    },
    {
      id: 2,
      title: "Choose Your Goal",
      color: "#FF6636",
      bg: "rgba(255, 102, 54, 0.1)",
    },
    {
      id: 3,
      title: "Start Learning Instantly",
      color: "#E328AF",
      bg: "rgba(227, 40, 175, 0.1)",
    },
    {
      id: 4,
      title: "Track Your Progress",
      color: "#23BD33",
      bg: "rgba(35, 189, 51, 0.1)",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#F5F7FA", py: { xs: 8, md: 12 }, mt: 8 }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Left Section - Promo */}
          <Grid item xs={12} lg={7}>
            <Box
              sx={{
                bgcolor: "var(--secondary)",
                borderRadius: "30px",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                minHeight: { xs: "auto", lg: "400px" },
              }}
            >
              <Box sx={{ flex: 1, zIndex: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-helvetica)",
                    fontWeight: 700,
                    fontSize: { xs: "28px", md: "36px" },
                    color: "#fff",
                    mb: 2,
                  }}
                >
                  How It Works
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "var(--font-satoshi)",
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.9)",
                    mb: 4,
                    maxWidth: "400px",
                    lineHeight: 1.6,
                  }}
                >
                  Instructors from around the world teach millions of students.
                  We provide the tools and skills to teach what you love.
                </Typography>

                <Button
                  variant="contained"
                  href="/signIn"
                  sx={{
                    bgcolor: "var(--primary)",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    px: 4,
                    py: 1.5,
                    borderRadius: "50px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    "&:hover": {
                      bgcolor: "#145e52",
                    },
                  }}
                >
                  Login Here
                </Button>
              </Box>

              {/* Images */}
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  height: { xs: "300px", md: "100%" },
                  width: "100%",
                  mt: { xs: 4, md: 0 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: { xs: "5%", lg: "10%" },
                  }}
                >
                  <Image
                    src={iphone}
                    alt="App Interface"
                    width={180}
                    height={360}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: { xs: 0, lg: 0 },
                  }}
                >
                  <Image
                    src={Instructor}
                    alt="Instructor"
                    width={220}
                    height={280}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Section - Steps */}
          <Grid item xs={12} lg={5}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: "30px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontWeight: 700,
                  fontSize: { xs: "24px", md: "32px" },
                  color: "var(--foreground)",
                  mb: 6,
                }}
              >
                Getting Started is Easy
              </Typography>

              <Grid container spacing={4}>
                {steps.map((step) => (
                  <Grid item xs={12} sm={6} key={step.id}>
                    <Stack direction="row" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          bgcolor: step.bg,
                          color: step.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "20px",
                          fontFamily: "var(--font-helvetica)",
                          flexShrink: 0,
                        }}
                      >
                        {step.id}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-satoshi)",
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#4B5563",
                          lineHeight: 1.4,
                        }}
                      >
                        {step.title}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
