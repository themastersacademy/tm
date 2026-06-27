"use client";
import React from "react";
import { Box, Typography, Container, Paper, Stack } from "@mui/material";
import PeopleIcon from "@/public/image/People.png";
import Profile from "@/public/image/profile.png";
import Image from "next/image";

const LookingFor = () => {
  // Real student achievements sourced from The Masters Academy profile.
  const successStories = [
    {
      category: "GATE 2024",
      highlight: "74 Marks",
      caption: "GATE Score",
      name: "Chemuru Udhayakumar",
      dept: "Electronics & Communication",
      place: "GATE 2024 Top Scorer",
      profile: Profile,
    },
    {
      category: "GATE 2024",
      highlight: "70 Marks",
      caption: "GATE Score",
      name: "Naveenkumar S",
      dept: "Mechanical Engineering",
      place: "IIT Madras",
      profile: Profile,
    },
    {
      category: "GATE 2024",
      highlight: "AIR 65",
      caption: "65 Marks · GATE",
      name: "Dinesh Chandran",
      dept: "Electronics & Communication",
      place: "IIT Madras",
      profile: Profile,
    },
    {
      category: "GATE 2024",
      highlight: "61 Marks",
      caption: "GATE Score",
      name: "Sarayu Miththira",
      dept: "Computer Science",
      place: "IIT Bombay",
      profile: Profile,
    },
    {
      category: "GATE 2024",
      highlight: "54 Marks",
      caption: "GATE Score",
      name: "Ashok",
      dept: "Mechanical Engineering",
      place: "IIT Palakkad",
      profile: Profile,
    },
    {
      category: "GATE 2024",
      highlight: "51 Marks",
      caption: "GATE Score",
      name: "Shalom Shawag Y",
      dept: "Mechanical Engineering",
      place: "IIT Madras",
      profile: Profile,
    },
    {
      category: "PSU Placement",
      highlight: "15 LPA",
      caption: "Annual Package",
      name: "P. Santhosh Kumar",
      dept: "Deputy Executive Engineer",
      place: "NLC India Limited",
      profile: Profile,
    },
    {
      category: "PSU Placement",
      highlight: "13 LPA",
      caption: "Annual Package",
      name: "Gowtham P",
      dept: "Airport Authority of India",
      place: "Coimbatore",
      profile: Profile,
    },
    {
      category: "PSU Placement",
      highlight: "12 LPA",
      caption: "Annual Package",
      name: "Hemanth Kumar",
      dept: "Engineer",
      place: "Hindustan Petroleum (HPCL)",
      profile: Profile,
    },
    {
      category: "NIT Admission",
      highlight: "NIT Trichy",
      caption: "Admission",
      name: "Harikrishnan",
      dept: "Mechanical Engineering",
      place: "National Institute of Technology",
      profile: Profile,
    },
  ];

  return (
    <Container
      maxWidth="xl"
      id="testimonials"
      sx={{
        mt: { xs: 8, md: 16 },
        scrollMarginTop: "10vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Image
        src={PeopleIcon}
        alt="People"
        width={56}
        height={67}
        style={{ marginBottom: 24 }}
      />

      <Typography
        component="h2"
        sx={{
          fontFamily: "var(--font-helvetica)",
          fontWeight: 600,
          fontSize: { xs: "24px", sm: "36px", md: "48px" },
          lineHeight: 1.2,
          mb: 2,
          maxWidth: "800px",
        }}
      >
        Real results from learners who{" "}
        <Box component="span" sx={{ color: "var(--secondary)" }}>
          achieved their dreams
        </Box>
      </Typography>

      <Typography
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontWeight: 400,
          fontSize: { xs: "16px", md: "18px" },
          color: "var(--text-gray)",
          maxWidth: "700px",
          mb: 6,
        }}
      >
        From top GATE ranks to PSU placements and NIT admissions — these are the
        success stories our students built through The Masters Academy.
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 4,
          px: 1,
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {successStories.map((story, index) => (
          <StoryCard key={index} story={story} />
        ))}
      </Box>
    </Container>
  );
};

const StoryCard = ({ story }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: { xs: "280px", md: "360px" },
        maxWidth: { xs: "280px", md: "380px" },
        minHeight: { xs: "240px", md: "260px" },
        borderRadius: "24px",
        border: "1px solid #E5E7EB",
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "left",
        transition: "all 0.3s",
        "&:hover": {
          boxShadow: "0px 10px 30px rgba(0,0,0,0.05)",
          borderColor: "transparent",
        },
      }}
    >
      <Box>
        <Box
          component="span"
          sx={{
            display: "inline-block",
            fontFamily: "var(--font-satoshi)",
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: "#187163",
            bgcolor: "rgba(24, 113, 99, 0.08)",
            borderRadius: "50px",
            px: 1.5,
            py: 0.5,
            mb: 2.5,
          }}
        >
          {story.category}
        </Box>

        <Typography
          sx={{
            fontFamily: "var(--font-helvetica)",
            fontWeight: 700,
            fontSize: { xs: "32px", md: "40px" },
            lineHeight: 1.1,
            color: "var(--secondary)",
          }}
        >
          {story.highlight}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-satoshi)",
            fontSize: "14px",
            color: "var(--text-gray)",
            mt: 0.5,
          }}
        >
          {story.caption}
        </Typography>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ mt: 3 }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-helvetica)",
              fontWeight: 700,
              fontSize: "18px",
              color: "#111827",
            }}
          >
            {story.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-helvetica)",
              fontWeight: 500,
              fontSize: "14px",
              color: "#4A6778",
              mt: 0.5,
            }}
          >
            {story.dept}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-helvetica)",
              fontWeight: 500,
              fontSize: "14px",
              color: "#9CA3AF",
            }}
          >
            {story.place}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 60,
            height: 60,
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Image
            src={story.profile}
            alt={story.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default LookingFor;
