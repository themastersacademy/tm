"use client";
import React from "react";
import { Box, Typography, Container, Grid, Paper, Stack } from "@mui/material";
import Logo from "@/public/images/masters-logo.svg";
import Vivek from "@/public/image/vivek.png";
import Sathya from "@/public/image/Sathya.png";
import Hari from "@/public/image/Hari.png";
import Image from "next/image";

const Founders = () => {
  const founders = [
    {
      name: "Mr. Vivekanathan Ragunathan",
      role: "Co-Founder",
      description: (
        <>
          A GATE expert with{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            10+ years{" "}
          </Box>
          of experience, three-time qualifier, mentor to{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            1,00,000+ students{" "}
          </Box>{" "}
          , and award-winning innovator.
        </>
      ),
      image: Vivek,
    },
    {
      name: "Mr. Hariprasanth Ragunathan",
      role: "Co-Founder",
      description: (
        <>
          He has{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            9+ years{" "}
          </Box>{" "}
          of experience in engineering math and aptitude, mentoring{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            1 lakh+{" "}
          </Box>{" "}
          students. His passion sparked The Masters Academy.
        </>
      ),
      image: Hari,
    },
    {
      name: "Mr. Sathyamoorthy V",
      role: "Co-Founder",
      description: (
        <>
          He has{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            4+ years{" "}
          </Box>{" "}
          experience training{" "}
          <Box
            component="span"
            sx={{ color: "var(--secondary)", fontWeight: 700 }}
          >
            10,000+{" "}
          </Box>{" "}
          students in Engineering tools and government exam prep.
        </>
      ),
      image: Sathya,
    },
  ];

  return (
    <Container
      maxWidth="xl"
      id="mentors"
      sx={{
        mt: { xs: 8, md: 16 },
        scrollMarginTop: "10vh",
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontWeight: 700,
          fontSize: "14px",
          color: "#187163",
          mb: 1.5,
          textTransform: "uppercase",
          display: "inline-block",
          px: 2,
          py: 0.5,
          bgcolor: "rgba(24, 113, 99, 0.08)",
          borderRadius: "50px",
        }}
      >
        Leadership Team
      </Typography>

      <Typography
        component="h2"
        align="center"
        sx={{
          fontFamily: "var(--font-helvetica)",
          fontWeight: 700,
          fontSize: { xs: "32px", md: "56px" },
          mb: { xs: 6, md: 10 },
          lineHeight: 1.2,
          color: "var(--foreground)",
        }}
      >
        Guided by the Best to{" "}
        <Box component="span" sx={{ color: "var(--secondary)" }}>
          Become the Best
        </Box>
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {founders.map((founder, index) => (
          <Grid
            key={index}
            item
            xs={12}
            md={6}
            lg={4}
            display="flex"
            justifyContent="center"
          >
            <FounderCard founder={founder} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const FounderCard = ({ founder }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "32px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        position: "relative",
        p: { xs: 3, sm: 4 },
        width: "100%",
        maxWidth: "420px",
        height: { xs: "auto", sm: "480px" },
        bgcolor: "#fff",
        border: "1px solid #F3F4F6",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          borderColor: "var(--secondary)",
        },
      }}
    >
      {/* Decorative gradient blob */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          background:
            "radial-gradient(circle, rgba(254, 194, 77, 0.15) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%",
          opacity: 0.8,
        }}
      />

      <Typography
        sx={{
          color: "#051e1a",
          fontFamily: "var(--font-helvetica)",
          fontWeight: 700,
          fontSize: { xs: "18px", md: "20px" },
          textAlign: "left",
        }}
      >
        {founder.name}
      </Typography>

      <Typography
        paragraph
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontSize: "16px",
          width: "100%",
          lineHeight: 1.6,
          color: "var(--text-gray)",
          textAlign: "left",
          mb: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        {founder.description}
      </Typography>

      <Box
        sx={{ mt: "auto", position: "relative", zIndex: 2, textAlign: "left" }}
      >
        <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
          <Image
            src={Logo}
            alt="Logo"
            width={70}
            height={24}
            style={{ width: "auto", height: "18px" }}
          />
        </Stack>

        <Typography
          sx={{
            color: "var(--secondary)",
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: "16px",
            letterSpacing: 0.5,
          }}
        >
          {founder.role}
        </Typography>
      </Box>

      {/* Image anchored to bottom right */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          zIndex: 1,
          width: { xs: 200, sm: 260 },
          height: { xs: 220, sm: 320 },
          // Add a subtle gradient mask at the bottom if needed, but clean pngs work best
        }}
      >
        <Image
          src={founder.image}
          alt={founder.name}
          fill
          style={{ objectFit: "contain", objectPosition: "bottom right" }}
        />
      </Box>
    </Paper>
  );
};

export default Founders;
