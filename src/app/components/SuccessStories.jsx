"use client";
import React from "react";
import { Box, Typography, Container, Grid, Paper, Chip } from "@mui/material";

const SuccessStories = () => {
  // Verified student achievements from The Masters Academy profile.
  const stories = [
    {
      name: "Naveenkumar S",
      initials: "NS",
      rank: "70 Marks (GATE - Mech)",
      exam: "GATE 2024",
      detail: "Secured admission to IIT Madras.",
      color: "#E3F2FD",
      accent: "#2196F3",
    },
    {
      name: "Dinesh Chandran",
      initials: "DC",
      rank: "AIR 65 · 65 Marks (GATE - ECE)",
      exam: "GATE 2024",
      detail: "Secured admission to IIT Madras.",
      color: "#FFF3E0",
      accent: "#FF9800",
    },
    {
      name: "P. Santhosh Kumar",
      initials: "PS",
      rank: "₹15 LPA Placement",
      exam: "PSU Placement",
      detail: "Deputy Executive Engineer, NLC India Limited.",
      color: "#E8F5E9",
      accent: "#4CAF50",
    },
  ];

  return (
    <Container
      maxWidth="lg"
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
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              sx={{ display: "flex", justifyContent: "center" }}
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
          height: "180px",
          bgcolor: story.color,
          borderRadius: "20px",
          position: "relative",
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-helvetica)",
              fontWeight: 700,
              fontSize: "36px",
              color: story.accent,
            }}
          >
            {story.initials}
          </Typography>
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
        }}
      >
        {story.detail}
      </Typography>
    </Paper>
  );
};

export default SuccessStories;
