"use client";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { FIBOptionsCard, OptionsCard } from "./OptionsCard";
import { Bookmark, BookmarkBorder, East, West } from "@mui/icons-material";

export default function ExamQuestionCard({
  questions,
  questionState,
  userAnswer,
  updateUserAnswer,
  pMark,
  nMark,
  handleOnNextQuestion,
  handleOnPreviousQuestion,
}) {
  const question =
    questions[questionState?.selectedSectionIndex]?.questions[
      questionState?.selectedQuestionIndex
    ];

  const handleChangeFIB = ({ value, blankIndex }) => {
    const updatedBlankAnswers = userAnswer?.blankAnswers;
    updatedBlankAnswers[blankIndex] = value || "";
    console.log(updatedBlankAnswers);
    updateUserAnswer(question?.questionID, "blankAnswers", {
      ...userAnswer,
      blankAnswers: updatedBlankAnswers,
    });
  };

  const handleSelectOption = (optionId) => {
    let updatedSelectedOptions = userAnswer?.selectedOptions;
    if (question?.type === "MCQ") {
      if (updatedSelectedOptions.includes(optionId)) {
        updatedSelectedOptions = updatedSelectedOptions.filter(
          (id) => id !== optionId
        );
      } else {
        updatedSelectedOptions = [optionId];
      }
    } else if (question?.type === "MSQ") {
      updatedSelectedOptions = updatedSelectedOptions.includes(optionId)
        ? updatedSelectedOptions.filter((id) => id !== optionId)
        : [...updatedSelectedOptions, optionId];
    }
    updateUserAnswer(question?.questionID, "selectedOptions", {
      ...userAnswer,
      selectedOptions: updatedSelectedOptions,
    });
  };

  const handleOnMark = () => {
    const markedForReview = userAnswer?.markedForReview;
    updateUserAnswer(question?.questionID, "markedForReview", {
      ...userAnswer,
      markedForReview: !markedForReview,
    });
    console.log({
      ...userAnswer,
      markedForReview: !markedForReview,
    });
  };

  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        minHeight: "350px",
        minWidth: "300px",
        width: {
          xs: "100%",
          sm: "100%",
          md: "90%",
          lg: "100%",
        },
        maxWidth: {
          xs: "100%",
          sm: "100%",
          md: "1200px",
          lg: "1200px",
        },
        backgroundColor: "var(--white)",
        padding: { xs: "10px", sm: "20px", md: "20px", lg: "30px" },
        gap: "10px",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="10px" width="100%">
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
        >
          Q {questionState.questionNo}
        </Typography>
        <IconButton onClick={handleOnMark}>
          {userAnswer?.markedForReview ? (
            <Bookmark sx={{ color: "var(--sec-color)" }} />
          ) : (
            <BookmarkBorder sx={{ color: "var(--sec-color)" }} />
          )}
        </IconButton>
        <Stack flexDirection="row" gap="10px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              width: "auto",
              height: "28px",
              color: "var(--primary-color)",
              backgroundColor: "var(--primary-color-acc-2)",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            +{pMark || 0}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              minWidth: "25px",
              height: "28px",
              color: "var(--sec-color)",
              backgroundColor: "var(--sec-color-acc-1)",
              padding: "5px",
              borderRadius: "4px",
            }}
          >
            -{nMark || 0}
          </Typography>
        </Stack>
        <Stack
          flexDirection="row"
          gap="10px"
          sx={{ marginLeft: "auto", display: { xs: "none", md: "flex" } }}
        >
          <Button
            variant="contained"
            startIcon={<West />}
            disabled={
              questionState.selectedQuestionIndex === 0 &&
              questionState.selectedSectionIndex === 0
            }
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              width: "90px",
              height: "28px",
              color: "var(--text1)",
              backgroundColor: "var(--border-color)",
              textTransform: "none",
            }}
            disableElevation
            onClick={handleOnPreviousQuestion}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={<East />}
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              width: "90px",
              height: "28px",
              color: "var(--primary-color)",
              backgroundColor: "var(--primary-color-acc-2)",
              textTransform: "none",
            }}
            disableElevation
            disabled={
              questionState?.sectionViseQuestionCount?.length ===
                questionState?.selectedSectionIndex + 1 &&
              questionState?.sectionViseQuestionCount[
                questionState?.selectedSectionIndex
              ] ===
                questionState?.selectedQuestionIndex + 1
            }
            onClick={handleOnNextQuestion}
          >
            Next
          </Button>
        </Stack>
      </Stack>

      <Stack flexDirection="row" justifyContent="space-between">
        <MDPreview value={question?.title} />
      </Stack>

      <Stack flexDirection="row" flexWrap="wrap" gap="20px">
        {question?.type === "FIB" ? (
          <FIBOptionsCard
            noOfBlanks={question?.noOfBlanks}
            onChange={handleChangeFIB}
            value={userAnswer?.blankAnswers}
          />
        ) : (
          <OptionsCard
            option={question?.options}
            type={question?.type}
            selectedOptions={userAnswer?.selectedOptions}
            onSelect={handleSelectOption}
          />
        )}
      </Stack>
    </Stack>
  );
}
