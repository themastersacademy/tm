"use client";
import React from "react";
import { Box, Typography, Container, Grid, Paper, Chip } from "@mui/material";
import Person from "@/public/image/successstoryCard.png";
import Girl1 from "@/public/image/girl_1.png";
import Girl2 from "@/public/image/girl_2.png";
import Image from "next/image";

const SuccessStories = () => {
  const stories = [
    {
      name: "Sanya Mirzas",
      rank: "AIR 12 (GATE - CSE)",
      exam: "GATE 2024",
      quote:
        "The structured curriculum and mock tests were a game changer for me.",
      image: Girl1,
      color: "#E3F2FD",
      accent: "#2196F3",
    },
    {
      name: "Priya Venkatesh",
      rank: "AIR 85 (GATE - EEE)",
      exam: "GATE 2023",
      quote:
        "Expert mentors helped me clear my doubts and concepts thoroughly.",
      image: Person, // Using the original image
      color: "#FFF3E0",
      accent: "#FF9800",
    },
    {
      name: "Sneha Reddy",
      rank: "Placed at Google",
      exam: "Campus Placements",
      quote:
        "TMA's aptitude training gave me the confidence to crack the interview.",
      image: Girl2,
      color: "#E8F5E9",
      accent: "#4CAF50",
    },
  ];

  return (
    <Container
      maxWidth="xl"
      id="success-stories"
      sx={{
        mt: { xs: 8, md: 16 },
        mb: { xs: 8, md: 16 },
        position: "relative",
        scrollMarginTop: "10vh",
      }}
    >
      <Box sx={{ position: "relative", pt: 6 }}>
        {/* Background Text */}
        <Typography
          sx={{
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: { xs: "50px", sm: "80px", md: "128px" },
            color: "#F0F0F0",
            position: "absolute",
            top: { xs: -20, md: -60 },
            left: 0,
            width: "100%",
            textAlign: "center",
            zIndex: 0,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: { xs: "none", sm: "block" },
          }}
        >
          Success Stories
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: { xs: "32px", md: "48px" },
            color: "var(--foreground)",
            textAlign: "center",
            mb: 6,
            position: "relative",
            zIndex: 1,
          }}
        >
          Real Success Stories
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          {stories.map((story, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              display="flex"
              justifyContent="center"
            >
              <StoryCard story={story} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

const StoryCard = ({ story }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "24px",
        position: "relative",
        width: "100%",
        maxWidth: "360px",
        border: "1px solid #F0F0F0",
        transition: "all 0.3s",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
          borderColor: story.accent,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "220px",
          bgcolor: story.color,
          borderRadius: "20px",
          position: "relative",
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            height: "90%",
            maxWidth: "280px",
          }}
        >
          <Image
            src={story.image}
            alt={story.name}
            fill
            style={{ objectFit: "contain", objectPosition: "bottom" }}
          />
        </Box>
      </Box>

      <Chip
        label={story.exam}
        size="small"
        sx={{
          bgcolor: story.color,
          color: story.accent,
          fontWeight: 700,
          mb: 2,
          fontFamily: "var(--font-satoshi)",
        }}
      />

      <Typography
        component="h3"
        sx={{
          fontFamily: "var(--font-helvetica)",
          fontWeight: 700,
          fontSize: "24px",
          color: "#111827",
          textAlign: "center",
          mb: 0.5,
        }}
      >
        {story.name}
      </Typography>

      <Typography
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontSize: "16px",
          color: "var(--primary)",
          fontWeight: 600,
          textAlign: "center",
          mb: 2,
        }}
      >
        {story.rank}
      </Typography>

      <Typography
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontSize: "14px",
          color: "#6B7280",
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        "{story.quote}"
      </Typography>
    </Paper>
  );
};

export default SuccessStories;
