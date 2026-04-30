"use client";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useEffect } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard Global Error:", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
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
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: "var(--delete-color)" }} />
        <Stack gap={1}>
          <Typography variant="h5" fontWeight={800} color="var(--text1)">
            Oops! Something went wrong.
          </Typography>
          <Typography color="var(--text3)">
            We encountered an unexpected error while loading this page.
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
