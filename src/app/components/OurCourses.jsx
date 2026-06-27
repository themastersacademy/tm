"use client";

import React, { useRef } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Section from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BusinessIcon from "@mui/icons-material/Business";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const OurCourses = () => {
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  const courses = [
    {
      indx: "01",
      title: "GATE Coaching",
      icon: <EngineeringIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Comprehensive preparation for GATE CSE, ECE, EEE, and Mech. Master concepts with expert faculty and proven strategies.",
    },
    {
      indx: "02",
      title: "Banking Exams",
      icon: <AccountBalanceIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Ace IBPS PO, Clerk, and SBI exams. Focus on speed, accuracy, and shortcut techniques for high scores.",
    },
    {
      indx: "03",
      title: "Campus Placements",
      icon: <BusinessIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Get interview-ready with complete aptitude training, logical reasoning, and soft skills development.",
    },
    {
      indx: "04",
      title: "TNPSC / Gov Exams",
      icon: <PublicIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Dedicated coaching for TNPSC Group 1, 2, and 4. Extensive syllabus coverage and regular mock tests.",
    },
    {
      indx: "05",
      title: "SSC CGL / CHSL",
      icon: <SchoolIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Crack Staff Selection Commission exams with our structured curriculum and previous year paper analysis.",
    },
    {
      indx: "06",
      title: "Test Series",
      icon: <QuizIcon sx={{ fontSize: 40, color: "#FEC24D" }} />,
      body: "Practice with India's most trusted mock test series. Real-time analysis to track your performance and growth.",
    },
  ];

  return (
    <Section id="courses">
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "flex-end" }}
        justifyContent="space-between"
        mb={{ xs: 5, md: 8 }}
        gap={4}
      >
        <SectionHeading
          align="left"
          eyebrow="Our Programs"
          maxWidth={620}
          sx={{ mb: 0 }}
          title={
            <>
              Explore Our{" "}
              <Box component="span" sx={{ color: "var(--secondary)" }}>
                Top-Rated
              </Box>{" "}
              Courses
            </>
          }
        />

        <Stack
          direction="row"
          gap={2}
          sx={{ display: { xs: "none", md: "flex" }, flexShrink: 0 }}
        >
          <IconButton
            onClick={() => scroll(-450)}
            sx={{
              width: 56,
              height: 56,
              border: "1px solid #E5E7EB",
              "&:hover": {
                bgcolor: "var(--secondary)",
                color: "#fff",
                borderColor: "var(--secondary)",
              },
              transition: "all 0.2s",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={() => scroll(450)}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "var(--secondary)",
              color: "#fff",
              "&:hover": { bgcolor: "#EAB13C" },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 3,
          overflowX: "auto",
          overflowY: "visible", // Allow hover effects to overflow
          pb: 4, // Space for hover shadow
          px: 1,
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {courses.map((item, index) => (
          <Box
            key={index}
            sx={{
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              height: "auto",
              bgcolor: "#fff",
              borderRadius: "24px",
              border: "1px solid #F3F4F6",
              position: "relative",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                borderColor: "var(--secondary)",
                "& .arrow-icon": {
                  transform: "translateX(5px)",
                  color: "var(--secondary)",
                },
              },
            }}
          >
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
                mb={3}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "16px",
                    bgcolor: "#FFFBEB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "rgba(0,0,0,0.05)",
                    fontFamily: "var(--font-satoshi)",
                    lineHeight: 1,
                  }}
                >
                  {item.indx}
                </Typography>
              </Stack>

              <Typography
                component="h3"
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#111827",
                  mb: 1.5,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "var(--font-satoshi)",
                  color: "#6B7280",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  mb: 4,
                  flexGrow: 1,
                }}
              >
                {item.body}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "15px",
                    fontFamily: "var(--font-satoshi)",
                    color: "#111827",
                  }}
                >
                  Explore Course
                </Typography>
                <ArrowRightAltIcon
                  className="arrow-icon"
                  sx={{ transition: "all 0.2s" }}
                />
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
};

export default OurCourses;
