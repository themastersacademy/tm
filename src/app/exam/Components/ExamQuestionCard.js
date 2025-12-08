"use client";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import { Button, IconButton, Stack, Typography, Box } from "@mui/material";
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
  if (!questions || !questions[questionState?.selectedSectionIndex]) {
    return <Box>Loading Question...</Box>;
  }

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
    let updatedSelectedOptions = userAnswer?.selectedOptions || [];
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
  };

  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        minHeight: "400px",
        width: "100%",
        backgroundColor: "var(--white)",
        padding: { xs: "20px", md: "40px" },
        gap: "20px",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header Row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography
            sx={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text1)",
            }}
          >
            Question {questionState.questionNo}
          </Typography>
          <Stack direction="row" gap={1}>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--primary-color)",
                bgcolor: "var(--primary-color-acc-2)",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
              }}
            >
              +{pMark || 0}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--delete-color)",
                bgcolor: "var(--delete-color-acc-2)",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
              }}
            >
              -{nMark || 0}
            </Typography>
          </Stack>
        </Stack>

        <IconButton
          onClick={handleOnMark}
          sx={{
            color: userAnswer?.markedForReview
              ? "var(--sec-color)"
              : "var(--text3)",
            bgcolor: userAnswer?.markedForReview
              ? "var(--sec-color-acc-2)"
              : "transparent",
            "&:hover": {
              bgcolor: "var(--sec-color-acc-2)",
            },
          }}
        >
          {userAnswer?.markedForReview ? <Bookmark /> : <BookmarkBorder />}
        </IconButton>
      </Stack>

      {/* Question Content */}
      <Box sx={{ flex: 1 }}>
        <MDPreview value={question?.title} />
      </Box>

      {/* Options */}
      <Box sx={{ mt: 2 }}>
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
      </Box>

      {/* Navigation Footer */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ display: "flex", mt: 4 }}
      >
        <Button
          variant="outlined"
          startIcon={<West />}
          disabled={
            questionState.selectedQuestionIndex === 0 &&
            questionState.selectedSectionIndex === 0
          }
          onClick={handleOnPreviousQuestion}
          sx={{ textTransform: "none", borderRadius: "10px" }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          endIcon={<East />}
          onClick={handleOnNextQuestion}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
          }}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
