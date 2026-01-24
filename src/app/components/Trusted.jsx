"use client";
import React from "react";
import { Box, Typography, Container, Stack } from "@mui/material";
import SRM from "@/public/image/SRM.png";
import Kpr from "@/public/image/Kpr.png";
import SREC from "@/public/image/SREC.png";
import Bannari from "@/public/image/Bannari.png";
import Kumaraguru from "@/public/image/Kumaraguru.png";
import Panimalar from "@/public/image/Panimalar.png";
import Image from "next/image";

const Trusted = () => {
  const logos = [Kpr, Kumaraguru, Bannari, SREC, Panimalar, SRM];

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 8, md: 16 } }}>
      <Typography
        align="center"
        sx={{
          fontFamily: "var(--font-helvetica)",
          fontWeight: 600,
          fontSize: { xs: "24px", md: "30px" },
          mb: { xs: 4, md: 8 },
          color: "var(--foreground)",
        }}
      >
        Trusted By
      </Typography>

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        gap={{ xs: 4, md: 8 }}
      >
        {logos.map((logo, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: { xs: 100, sm: 120, md: 150 },
              height: { xs: 60, sm: 80 },
              filter: "grayscale(100%)",
              opacity: 0.7,
              transition: "all 0.3s",
              "&:hover": {
                filter: "none",
                opacity: 1,
              },
            }}
          >
            <Image
              src={logo}
              alt="Partner Logo"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        ))}
      </Stack>
    </Container>
  );
};

export default Trusted;
