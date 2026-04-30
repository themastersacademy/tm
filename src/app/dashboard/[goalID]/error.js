"use client";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useEffect } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Dashboard Module Error:", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Stack
        alignItems="center"
        gap={3}
        sx={{
          bgcolor: "white",
          p: 5,
          borderRadius: "24px",
          border: "1px solid var(--border-color)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: "var(--delete-color)" }} />
        <Stack gap={1}>
          <Typography variant="h5" fontWeight={800} color="var(--text1)">
            Unable to load module
          </Typography>
          <Typography color="var(--text3)">
            Something went wrong while fetching data for this section.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          onClick={() => reset()}
          sx={{
            mt: 2,
            bgcolor: "var(--primary-color)",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "12px",
            px: 4,
            py: 1.5,
          }}
        >
          Try Again
        </Button>
      </Stack>
    </Box>
  );
}
