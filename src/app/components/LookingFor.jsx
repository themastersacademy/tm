"use client";
import React from "react";
import { Box, Typography, Container, Paper, Stack } from "@mui/material";
import PeopleIcon from "@/public/image/People.png";
import Profile from "@/public/image/profile.png";
import Image from "next/image";

const LookingFor = () => {
  const reviews = [
    {
      description:
        "Thanks to The Masters Academy, I cleared GATE with excellent scores! The mentors are knowledgeable and truly supportive.",
      name: "Anjali R",
      dept: "Mechanical Engineer",
      location: "Chennai",
      profile: Profile,
    },
    {
      description:
        "The structured curriculum and expert guidance helped me crack the exam in my first attempt. Highly recommended!",
      name: "Karthik S",
      dept: "Computer Science",
      location: "Bangalore",
      profile: Profile,
    },
    {
      description:
        "I am grateful for the personalized attention and doubt-clearing sessions. It made a huge difference in my preparation.",
      name: "Priya M",
      dept: "Civil Engineer",
      location: "Coimbatore",
      profile: Profile,
    },
    {
      description:
        "The test series was very comprehensive and close to the actual exam pattern. It boosted my confidence significantly.",
      name: "Rahul V",
      dept: "Electronics Engineer",
      location: "Hyderabad",
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
        We’ve got lots of friends, and we’re always{" "}
        <Box component="span" sx={{ color: "var(--secondary)" }}>
          looking for more
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
        Trusted by Thousands, Loved by Many, Real Success Stories from Learners
        Who Achieved Their Dreams Through Our Coaching
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
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </Box>
    </Container>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: { xs: "300px", md: "450px" },
        maxWidth: { xs: "300px", md: "520px" },
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
      <Typography
        sx={{
          fontFamily: "var(--font-satoshi)",
          fontSize: "16px",
          color: "#4B5563",
          lineHeight: 1.6,
          mb: 4,
        }}
      >
        "{review.description}"
      </Typography>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
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
            {review.name}
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
            {review.dept}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-helvetica)",
              fontWeight: 500,
              fontSize: "14px",
              color: "#9CA3AF",
            }}
          >
            {review.location}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 60,
            height: 60,
            position: "relative",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Image
            src={review.profile}
            alt={review.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default LookingFor;
