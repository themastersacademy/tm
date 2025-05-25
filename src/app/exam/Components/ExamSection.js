"use client";
import { Bookmark } from "@mui/icons-material";
import { Stack, Typography, Button, Badge } from "@mui/material";

export default function ExamSection({
  title,
  questions,
  sectionIndex,
  questionState,
  handleQuestionSelection,
  userAnswers,
}) {
  return (
    <Stack gap="10px" width="100%" sx={{ backgroundColor: "var(--white)" }}>
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "700" }}
      >
        {title}
      </Typography>
      <Stack flexDirection="row" flexWrap="wrap" gap={2}>
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

          return (
            <Badge
              key={question.questionID}
              invisible={!isMarked}
              badgeContent={
                <Bookmark
                  fontSize="small"
                  sx={{
                    color: "var(--sec-color)",
                    fontSize: "12px",
                    padding: "4px",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "var(--sec-color-acc-1)",
                    borderRadius: "50%",
                  }}
                />
              }
              // sx={{
              //   // bgcolor: "var(--sec-color)",
              //   borderRadius: "50%",
              // }}
            >
              <Button
                key={question.questionID}
                variant="outlined"
                sx={{
                  width: 35,
                  height: 35,
                  minWidth: 35,
                  borderRadius: !userAnswer ? "4px" : "50%",
                  fontWeight: "bold",
                  fontSize: "14px",
                  fontFamily: "Lato",
                  borderColor: "var(--border-color)",
                  backgroundColor: isAnswered
                    ? "var(--primary-color-acc-1)"
                    : questionState.selectedSectionIndex === sectionIndex &&
                      questionState.selectedQuestionIndex === index
                    ? "var(--border-color)"
                    : "transparent",
                  color: "var(--text2)",
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
      </Stack>
    </Stack>
  );
}
