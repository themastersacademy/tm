"use client";
import React from "react";
import { Box, Typography, Button, Grid, Stack, Container } from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Girl1 from "@/public/image/girl_1.png";
import Girl2 from "@/public/image/girl_2.png";
import Image from "next/image";
import BestIcon from "@/public/image/bestIcon.png";
import VideoIcon from "@/public/image/video-icon.png";

const MasterAcademy = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 8, md: 16 } }}>
      <Grid container spacing={8} alignItems="center">
        {/* Left Section - Images */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "500px",
              height: { xs: "400px", sm: "500px" },
              mx: "auto",
            }}
          >
            {/* Top Right Image */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: { xs: 0, sm: 40 },
                width: { xs: "180px", sm: "220px" },
                height: { xs: "240px", sm: "320px" },
                borderRadius: "0 90px 0 90px",
                overflow: "hidden",
                zIndex: 2,
                border: "4px solid white",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src={Girl1}
                alt="Student 1"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>

            {/* Bottom Left Image */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: { xs: 0, sm: 40 },
                width: { xs: "180px", sm: "220px" },
                height: { xs: "220px", sm: "300px" },
                borderRadius: "90px 0 90px 0",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <Image
                src={Girl2}
                alt="Student 2"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>

            {/* Floating Pill: Best Mentors */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 40, sm: 60 },
                left: { xs: -10, sm: 0 },
                bgcolor: "#FFFFFF",
                borderRadius: "50px",
                border: "1px solid #E5E5E5",
                p: 1,
                pr: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "#F5F2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src={BestIcon} alt="Best" width={24} height={24} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-helvetica)",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: 1.2,
                  }}
                >
                  BEST
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-satoshi)",
                    fontSize: "13px",
                    color: "var(--text-gray)",
                  }}
                >
                  Mentors
                </Typography>
              </Box>
            </Box>

            {/* Floating Pill: Video Lessons */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: 40, sm: 60 },
                right: { xs: -10, sm: 0 },
                bgcolor: "#FFFFFF",
                borderRadius: "50px",
                border: "1px solid #E5E5E5",
                p: 1,
                pr: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                zIndex: 3,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "#FFF9EE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image src={VideoIcon} alt="Video" width={24} height={24} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-helvetica)",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: 1.2,
                  }}
                >
                  VIDEO
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-satoshi)",
                    fontSize: "13px",
                    color: "var(--text-gray)",
                  }}
                >
                  Lessons
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Section - Content */}
        <Grid item xs={12} md={6}>
          <Stack gap={3}>
            <Box>
              <Typography
                sx={{
                  color: "#FEC555",
                  bgcolor: "#FFF9EE",
                  fontFamily: "var(--font-satoshi)",
                  fontWeight: 600,
                  fontSize: "14px",
                  py: 0.5,
                  px: 2,
                  borderRadius: "50px",
                  width: "fit-content",
                  mb: 2,
                }}
              >
                Master Academy
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontWeight: 700,
                  fontSize: { xs: "32px", md: "48px" },
                  lineHeight: 1.2,
                  color: "var(--foreground)",
                }}
              >
                Join Our Team – Inspire Learners Today!
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: "var(--font-satoshi)",
                color: "var(--text-gray)",
                fontSize: "16px",
                lineHeight: 1.6,
              }}
            >
              The Masters Academy provides coaching for placements, entrance,
              and competitive exams like GATE, IBPS, SSC, and government jobs.
              With experienced tutors and career guidance, the academy supports
              students’ success through training and awareness programs. It’s
              your trusted partner for career growth.
            </Typography>

            <Grid container spacing={2}>
              {[
                "Flexible Teaching Hours",
                "Grow With Us",
                "Access to Global Learners",
                "Competitive Compensation",
              ].map((text, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Stack direction="row" gap={1.5} alignItems="center">
                    <TaskAltIcon sx={{ color: "#FEC555" }} />
                    <Typography
                      sx={{
                        fontFamily: "var(--font-satoshi)",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {text}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              sx={{
                bgcolor: "var(--primary)",
                color: "#fff",
                borderRadius: "50px",
                width: "fit-content",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                fontFamily: "var(--font-satoshi)",
                fontWeight: 600,
                mt: 2,
                "&:hover": {
                  bgcolor: "#145e52",
                },
              }}
            >
              Join Our Team
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MasterAcademy;
