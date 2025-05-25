import StatisticCard from "@/src/Components/StatisticCard/StatisticCard";
import { Button, Stack, Typography } from "@mui/material";
import practice from "@/public/icons/practice.svg";
import mocks from "@/public/icons/mocks.svg";
import hours from "@/public/icons/hours.svg";
import courses from "@/public/icons/courses.svg";

export default function Overview({ result }) {
  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        minHeight: "200px",
        padding: { xs: "1px", md: "15px" },
        gap: "15px",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="15px">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "18px",
            fontWeight: "700",
            padding: "9px",
          }}
        >
          Overview
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary-color-acc-2)",
            color: "var(--primary-color)",
            height: "22px",
            textTransform: "none",
            fontSize: "10px",
            fontFamily: "Lato",
          }}
          disableElevation
        >
          Share
        </Button>
      </Stack>
      <Stack
        flexDirection="row"
        gap={{ xs: "4px", md: "25px" }}
        flexWrap="wrap"
        padding="2px"
        justifyContent={{ xs: "center", md: "flex-start" }}
        alignItems="center"
      >
        <StatisticCard
          title="Total marks "
          count={
            `${result?.obtainedMarks || 0} / ${result?.totalMarks || 0}` || 0
          }
          icon={practice}
        />
        <StatisticCard
          title="Correct"
          count={result?.totalCorrectAnswers || "0"}
          icon={mocks}
        />
        <StatisticCard
          title="Incorrect"
          count={result?.totalWrongAnswers || "0"}
          icon={hours}
        />
        <StatisticCard
          title="Unanswered"
          count={
            result?.totalQuestions -
              (result?.totalSkippedAnswers + result?.totalAttemptedAnswers) ||
            "0"
          }
          icon={courses}
        />
        <StatisticCard
          title="Skipped"
          count={result?.totalSkippedAnswers || "0"}
          icon={courses}
        />
      </Stack>
    </Stack>
  );
}
