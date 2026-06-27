"use client";
import React from "react";
import { Box, Typography, Stack } from "@mui/material";

/**
 * SectionHeading — consistent eyebrow + title + subtitle block used across
 * every landing section. Keeps type scale, weight, color and alignment
 * identical everywhere so headings line up section to section.
 *
 * Props:
 *  - eyebrow  : small uppercase label above the title (optional)
 *  - title    : string or node (use <Box component="span"> for accent words)
 *  - subtitle : supporting line below the title (optional)
 *  - align    : "center" (default) | "left"
 *  - maxWidth : cap the title/subtitle column width (default 760)
 *  - sx       : overrides for the wrapper
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  maxWidth = 760,
  sx = {},
}) => {
  const isCenter = align === "center";

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: isCenter ? "center" : "flex-start",
        textAlign: isCenter ? "center" : "left",
        mx: isCenter ? "auto" : 0,
        maxWidth,
        mb: { xs: 5, md: 8 },
        ...sx,
      }}
    >
      {eyebrow && (
        <Box
          component="span"
          sx={{
            fontFamily: "var(--font-satoshi)",
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: 1,
            textTransform: "uppercase",
            color: "var(--secondary)",
            bgcolor: "rgba(254, 168, 0, 0.10)",
            borderRadius: "50px",
            px: 2,
            py: 0.6,
          }}
        >
          {eyebrow}
        </Box>
      )}

      <Typography
        component="h2"
        sx={{
          fontFamily: "var(--font-helvetica)",
          fontWeight: 700,
          fontSize: { xs: "28px", sm: "34px", md: "44px" },
          lineHeight: 1.2,
          color: "var(--foreground)",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            fontFamily: "var(--font-satoshi)",
            fontSize: { xs: "15px", md: "18px" },
            lineHeight: 1.6,
            color: "var(--text-gray)",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
};

export default SectionHeading;
