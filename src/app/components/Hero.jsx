"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Stack,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import BtnIcon from "@/public/image/herobtn-icon.png";
import Image from "next/image";
import HeroBanner from "@/public/image/Hero_banner.png";
import VerifiedIcon from "@mui/icons-material/Verified";
import StarIcon from "@mui/icons-material/Star";

const Hero = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      id="home"
      sx={{
        width: "100%",
        pt: { xs: 2, md: 8 }, // Reduced top padding on mobile
        pb: { xs: 6, md: 4 },
        scrollMarginTop: "100px",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 4 }} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack
              gap={3}
              sx={{
                maxWidth: "600px",
                mx: { xs: "auto", md: 0 },
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  borderRadius: "50px",
                  bgcolor: "rgba(24, 113, 99, 0.08)",
                  border: "1px solid rgba(24, 113, 99, 0.1)",
                }}
              >
                <VerifiedIcon sx={{ color: "var(--primary)", fontSize: 18 }} />
                <Typography
                  sx={{
                    color: "var(--primary)",
                    fontFamily: "var(--font-satoshi)",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  India's Most Trusted Learning Platform
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontSize: { xs: "32px", sm: "40px", md: "56px", lg: "64px" },
                  fontWeight: 700,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  color: "var(--foreground)",
                }}
              >
                One{" "}
                <Box component="span" sx={{ color: "var(--secondary)" }}>
                  Academy
                </Box>{" "}
                <br sx={{ display: { xs: "none", md: "block" } }} />
                Thousands of Success Stories.
              </Typography>

              <Typography
                sx={{
                  fontFamily: "var(--font-abeezee)",
                  color: "var(--text-gray)",
                  fontSize: { xs: "15px", md: "16px" },
                  lineHeight: 1.6,
                  maxWidth: { xs: "100%", md: "90%" },
                }}
              >
                From GATE and Banking to in-demand career skills, our
                expert-led, flexible courses are built to fuel your ambition and
                deliver results.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap={2}
                alignItems="center"
                width={{ xs: "100%", sm: "auto" }}
              >
                <Button
                  onClick={() => scrollToSection("about-us")}
                  variant="outlined"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    px: 4,
                    py: 1.5,
                    color: "var(--foreground)",
                    textTransform: "none",
                    border: "1px solid var(--foreground)",
                    borderRadius: "50px",
                    fontFamily: "var(--font-satoshi)",
                    fontWeight: 600,
                    fontSize: "15px",
                    "&:hover": {
                      backgroundColor: "var(--foreground)",
                      color: "var(--background)",
                      border: "1px solid var(--foreground)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Start Learning
                </Button>

                <Button
                  onClick={() => scrollToSection("courses")}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    color: "var(--foreground)",
                    textTransform: "none",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 0,
                    fontFamily: "var(--font-satoshi)",
                    fontWeight: 600,
                    fontSize: "15px",
                    "&:hover": { backgroundColor: "transparent", opacity: 0.8 },
                  }}
                >
                  <Box
                    sx={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#ffffff",
                      borderRadius: "50%",
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <Image src={BtnIcon} alt="Play" width={20} height={20} />
                  </Box>
                  Watch Demo
                </Button>
              </Stack>

              {/* Stats / Social Proof */}
              <Stack direction="row" gap={2} alignItems="center" mt={1}>
                <AvatarGroup
                  max={4}
                  sx={{
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      borderColor: "#fff",
                    },
                  }}
                >
                  <Avatar alt="Student 1" src="/image/girl_1.png" />
                  <Avatar alt="Student 2" src="/image/girl_2.png" />
                  <Avatar alt="Student 3" src="/image/vivek.png" />
                  <Avatar alt="Student 4" src="/image/Hari.png" />
                </AvatarGroup>
                <Box>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "14px",
                        fontFamily: "var(--font-helvetica)",
                      }}
                    >
                      4.9/5
                    </Typography>
                    <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                    <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                    <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                    <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                    <StarIcon sx={{ color: "#FFD700", fontSize: 16 }} />
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "var(--text-gray)",
                      fontFamily: "var(--font-satoshi)",
                    }}
                  >
                    From 10k+ Student Reviews
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>

          {/* Right Image */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: "320px", sm: "400px", md: "600px", lg: "650px" }, // Reduced height on mobile
                width: "100%",
                maxWidth: "600px",
                // Adjusted scaling to be contained
                transform: {
                  md: "translateX(20px)",
                },
              }}
            >
              <Image
                src={HeroBanner}
                alt="Students"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
