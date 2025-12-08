"use client";
import MasterLogo from "@/src/Components/SideNav/MasterLogo";
import { Button, IconButton, Stack, Box, Typography } from "@mui/material";
import CountDownTimer from "./CountDownTimer";
import { Fullscreen, FullscreenExit, Logout } from "@mui/icons-material";

export default function ExamHeader({
  examData,
  now,
  toggleFullScreen,
  isFsEnabled,
  handleEndTest,
}) {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="100%"
      sx={{
        px: { xs: 2, md: 4 },
      }}
    >
      <MasterLogo />

      <Stack flexDirection="row" alignItems="center" gap={{ xs: 1, md: 3 }}>
        {/* Timer */}
        <Box
          sx={{
            bgcolor: "var(--sec-color-acc-2)",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
            border: "1px solid var(--sec-color-acc-1)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text3)",
              display: { xs: "none", md: "block" },
            }}
          >
            Time Left:
          </Typography>
          <CountDownTimer
            date={examData?.startTimeStamp + examData?.duration * 1000 * 60}
            now={now}
            basicStyled={true}
            loading={examData?.startTimeStamp == null}
            promptTimeOver="Time Over"
            onComplete={handleEndTest}
          />
        </Box>

        <Stack direction="row" gap={1}>
          <IconButton
            onClick={toggleFullScreen}
            sx={{
              color: "var(--text3)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            {isFsEnabled ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>

          <Button
            variant="contained"
            onClick={() => handleEndTest("USER")}
            startIcon={<Logout />}
            sx={{
              bgcolor: "white",
              color: "var(--delete-color)",
              border: "1px solid var(--delete-color-acc-1)",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "14px",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "var(--delete-color-acc-2)",
                border: "1px solid var(--delete-color)",
                boxShadow: "none",
              },
            }}
          >
            Finish
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
