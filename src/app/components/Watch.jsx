"use client";
import React from "react";
import { Box, Typography, Button, Container, Grid, Stack } from "@mui/material";
import TrackIcon from "@/public/image/TrackIcon.png";
import MockIcon from "@/public/image/MockIcon.png";
import RightImg from "@/public/image/WatchRightContainer.png";
import Image from "next/image";

const Watch = () => {
  return (
    <Box
      sx={{
        bgcolor: "#FFF9EE",
        py: { xs: 8, md: 12 },
        mt: { xs: 8, md: 16 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Stack gap={4}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-helvetica)",
                  fontSize: { xs: "32px", md: "48px" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: "var(--foreground)",
                }}
              >
                Watch. Practice. Master — Anytime, Anywhere.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-satoshi)",
                  color: "var(--text-gray)",
                  fontSize: { xs: "16px", md: "18px" },
                  lineHeight: 1.6,
                }}
              >
                With 24/7 video access and smart tests, Master Academy LMS makes
                your success flexible and unstoppable.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
                <Stack gap={2}>
                  <Image src={TrackIcon} alt="Track" width={76} height={58} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "var(--font-helvetica)",
                      fontWeight: 600,
                      fontSize: "20px",
                    }}
                  >
                    Track Your Progress
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-satoshi)",
                      color: "var(--text-gray)",
                      fontSize: "16px",
                    }}
                  >
                    Smart dashboards show your strengths and gaps — improve
                    faster, smarter.
                  </Typography>
                </Stack>

                <Stack gap={2}>
                  <Image src={MockIcon} alt="Mock" width={76} height={58} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "var(--font-helvetica)",
                      fontWeight: 600,
                      fontSize: "20px",
                    }}
                  >
                    Mock Test
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-satoshi)",
                      color: "var(--text-gray)",
                      fontSize: "16px",
                    }}
                  >
                    Simulate the real test environment and boost your confidence
                    before the big day.
                  </Typography>
                </Stack>
              </Stack>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "var(--primary)",
                  color: "#fff",
                  borderRadius: "50px",
                  px: 4,
                  py: 1.5,
                  width: "fit-content",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "16px",
                  "&:hover": {
                    bgcolor: "#145e52",
                  },
                }}
              >
                Start For Free
              </Button>
            </Stack>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "300px", md: "500px" },
              }}
            >
              <Image
                src={RightImg}
                alt="Watch and Practice"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Watch;
