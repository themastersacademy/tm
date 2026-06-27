"use client";
import React from "react";
import { Box, Container } from "@mui/material";

/**
 * Section — the single source of truth for landing-page vertical rhythm,
 * horizontal gutters, and content width. Every landing section renders inside
 * one so spacing and alignment are consistent by construction.
 *
 * Props:
 *  - id            : anchor id for in-page navigation
 *  - band          : when true, the section paints a full-bleed background
 *                    (pass `bg`) and the content stays inside the container
 *  - bg            : background color (used with band, or as a plain bg)
 *  - maxWidth      : container max width token (default "lg" = 1200px)
 *  - disableTop /
 *    disableBottom : trim the default vertical padding on one edge
 *  - sx            : style overrides for the outer wrapper
 *  - containerSx   : style overrides for the inner container
 */
const Section = ({
  id,
  band = false,
  bg,
  maxWidth = "lg",
  disableTop = false,
  disableBottom = false,
  sx = {},
  containerSx = {},
  children,
}) => {
  const py = {
    pt: disableTop ? 0 : { xs: 7, md: 11 },
    pb: disableBottom ? 0 : { xs: 7, md: 11 },
  };

  return (
    <Box
      id={id}
      component="section"
      sx={{
        scrollMarginTop: "96px",
        ...(band || bg ? { bgcolor: bg } : {}),
        ...py,
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth} sx={{ px: { xs: 2.5, sm: 3 }, ...containerSx }}>
        {children}
      </Container>
    </Box>
  );
};

export default Section;
