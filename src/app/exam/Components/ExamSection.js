"use client";
import { Bookmark } from "@mui/icons-material";
import { Stack, Typography, Button, Badge, Box } from "@mui/material";
import { memo } from "react";

const PaletteItem = memo(
  ({
    question,
    questionNo,
    userAnswer,
    isCurrent,
    handleQuestionSelection,
    sectionIndex,
    index,
  }) => {
    const isAnswered =
      userAnswer?.selectedOptions?.length > 0 ||
      userAnswer?.blankAnswers?.length > 0;
    const isMarked = userAnswer?.markedForReview;

    return (
      <Badge
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
          variant={isAnswered ? "contained" : "outlined"}
          disableElevation
          sx={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            borderRadius: isAnswered || isMarked ? "50%" : "4px",
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
  },
);

PaletteItem.displayName = "PaletteItem";

const ExamSection = memo(
  ({
    title,
    questions,
    sectionIndex,
    questionState,
    handleQuestionSelection,
    userAnswers,
  }) => {
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

            // Find the specific answer object for this question
            // Since userAnswers array reference changes on update, we rely on the fact
            // that ONLY the updated answer object changes reference.
            // The find() result will be reference-equal for unchanged questions.
            const userAnswer = userAnswers?.find(
              (ans) => ans.questionID === question.questionID,
            );

            const isCurrent =
              questionState.selectedSectionIndex === sectionIndex &&
              questionState.selectedQuestionIndex === index;

            return (
              <PaletteItem
                key={question.questionID}
                question={question}
                questionNo={questionNo}
                userAnswer={userAnswer}
                isCurrent={isCurrent}
                handleQuestionSelection={handleQuestionSelection}
                sectionIndex={sectionIndex}
                index={index}
              />
            );
          })}
        </Box>
      </Stack>
    );
  },
);

ExamSection.displayName = "ExamSection";

export default ExamSection;
