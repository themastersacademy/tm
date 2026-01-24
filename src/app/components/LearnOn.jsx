"use client";
import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import Laptop from "@/public/image/Laptop.png";
import Image from "next/image";

const LearnOn = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{ mt: { xs: 8, md: 16 }, scrollMarginTop: "10vh" }}
    >
      <Box
        sx={{
          borderRadius: { xs: "20px", md: "30px" },
          bgcolor: "#292113",
          overflow: "hidden",
          position: "relative",
          px: { xs: 3, md: 6 },
          pt: { xs: 4, md: 6 },
          pb: { xs: 0, md: 0 },
        }}
      >
        <Grid container alignItems="center" spacing={4}>
          {/* Text Content */}
          <Grid item xs={12} md={7} sx={{ pb: { xs: 4, md: 6 } }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-helvetica)",
                fontSize: { xs: "24px", sm: "32px", md: "40px" },
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.3,
                mb: 2,
              }}
            >
              Learn on your time, from anywhere — with Master{" "}
              <Box component="span" sx={{ color: "#FFB45C" }}>
                Academy’s powerful LMS
              </Box>{" "}
              by your Side.
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-satoshi)",
                color: "rgba(255,255,255,0.8)",
                fontSize: { xs: "16px", md: "18px" },
              }}
            >
              Track. Learn. Conquer —{" "}
              <Box
                component="span"
                sx={{
                  color: "#FFB45C",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                create an account
              </Box>
            </Typography>
          </Grid>

          {/* Image */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: "250px", sm: "350px", md: "400px" },
                mt: { xs: 0, md: 2 },
              }}
            >
              <Image
                src={Laptop}
                alt="LMS Interface on Laptop"
                fill
                style={{
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LearnOn;
