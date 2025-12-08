"use client";
import { Bookmark } from "@mui/icons-material";
import { Stack, Typography, Button, Badge, Box } from "@mui/material";

export default function ExamSection({
  title,
  questions,
  sectionIndex,
  questionState,
  handleQuestionSelection,
  userAnswers,
}) {
  return (
    <Stack gap="15px" width="100%" sx={{ backgroundColor: "var(--white)" }}>
      <Typography
        sx={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "14px",
          fontWeight: 700,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
          gap: "10px",
        }}
      >
        {questions.questions.map((question, index) => {
          let questionNo = questionState?.sectionViseQuestionCount
            ?.slice(0, sectionIndex)
            .reduce((sum, cnt) => sum + cnt, 0);
          questionNo += index + 1;
          const userAnswer = userAnswers?.find(
            (ans) => ans.questionID === question.questionID
          );
          const isAnswered =
            userAnswer?.selectedOptions?.length > 0 ||
            userAnswer?.blankAnswers?.length > 0;
          const isMarked = userAnswer?.markedForReview;
          const isCurrent =
            questionState.selectedSectionIndex === sectionIndex &&
            questionState.selectedQuestionIndex === index;

          return (
            <Badge
              key={question.questionID}
              invisible={!isMarked}
              overlap="circular"
              sx={{ justifySelf: "center" }}
              badgeContent={
                <Bookmark
                  fontSize="small"
                  sx={{
                    color: "var(--sec-color)",
                    fontSize: "12px",
                    padding: "2px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "var(--sec-color-acc-1)",
                    borderRadius: "50%",
                    border: "1px solid white",
                  }}
                />
              }
            >
              <Button
                key={question.questionID}
                variant={isAnswered ? "contained" : "outlined"}
                disableElevation
                sx={{
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                  borderRadius: isAnswered || isMarked ? "50%" : "4px", // Circle for Answered/Marked, Square for others
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "var(--font-geist-sans)",
                  borderColor: isCurrent
                    ? "var(--primary-color)"
                    : "var(--border-color)",
                  borderWidth: isCurrent ? "2px" : "1px",
                  backgroundColor: isAnswered
                    ? "var(--primary-color)"
                    : isCurrent
                    ? "white"
                    : "transparent",
                  color: isAnswered
                    ? "white"
                    : isCurrent
                    ? "var(--primary-color)"
                    : "var(--text2)",
                  "&:hover": {
                    borderColor: "var(--primary-color)",
                    backgroundColor: isAnswered
                      ? "var(--primary-color-dark)"
                      : "var(--primary-color-acc-2)",
                  },
                }}
                onClick={() => {
                  handleQuestionSelection({
                    sectionIndex,
                    questionIndex: index,
                  });
                }}
              >
                {questionNo}
              </Button>
            </Badge>
          );
        })}
      </Box>
    </Stack>
  );
}
