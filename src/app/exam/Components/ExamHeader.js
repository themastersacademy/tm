"use client";
import MasterLogo from "@/src/Components/SideNav/MasterLogo";
import { Button, IconButton, Stack } from "@mui/material";
import CountDownTimer from "./CountDownTimer";
import { Fullscreen, FullscreenExit } from "@mui/icons-material";

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
      width="100%"
      sx={{
        backgroundColor: "var(--white)",
        height: "60px",
        borderBottom: "1px solid var(--border-color)",
        padding: "20px",
      }}
    >
      <MasterLogo />
      <Stack flexDirection="row" alignItems="center" width="100%" gap="10px">
        <Stack
          width="100%"
          marginLeft="auto"
          sx={{ gap: "10px" }}
          alignItems={{ xs: "center", md: "flex-end", sm: "flex-end" }}
        >
          <CountDownTimer
            date={examData?.startTimeStamp + examData?.duration * 1000 * 60}
            now={now}
            basicStyled={true}
            loading={examData?.startTimeStamp == null}
            promptTimeOver="Time Over"
            onComplete={handleEndTest}
          />
        </Stack>
        <IconButton onClick={toggleFullScreen}>
          {isFsEnabled ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => handleEndTest("USER")}
          sx={{
            borderColor: "var(--delete-color)",
            textTransform: "none",
            color: "var(--delete-color)",
            width: "140px",
            fontFamily: "Lato",
            fontSize: { xs: "12px", md: "14px" },
            fontWeight: "700",
          }}
        >
          End
        </Button>
      </Stack>
    </Stack>
  );
}
