"use client";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function QuestionPreview({
  qNum,
  result,
  userAnswerList,
  answerList,
  showAnswers = true,
}) {
  const [expanded, setExpanded] = useState(false);

  // ... (toggle logic) ...

  const handleToggle = (event) => {
    event.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const userAnswer = userAnswerList.find(
    (answer) => answer.questionID === result.questionID
  );

  const answerInfo = answerList.find(
    (ans) => ans.questionID === result.questionID
  );

  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        padding: "12px",
        gap: "10px",
        width: "100%",
        bgcolor: "white",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="8px">
        {/* ... (header logic mostly same, keeping brevity) ... */}
        <Typography
          sx={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          Q{qNum}.
        </Typography>
        <Button
          disableElevation
          sx={{
            backgroundColor: "var(--sec-color-acc-1)",
            color: "var(--sec-color)",
            height: "20px",
            minWidth: "auto",
            px: 1,
            textTransform: "none",
            fontSize: "10px",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 600,
          }}
        >
          {result.type}
        </Button>

        <Stack
          flexDirection="row"
          gap="6px"
          sx={{ marginLeft: "auto" }}
          alignItems="center"
        >
          {/* Status Chips - Keep these as they are about user's attempt */}
          {(() => {
            const isSkippedMCQMSQ =
              (result.type === "MCQ" || result.type === "MSQ") &&
              userAnswer &&
              userAnswer.selectedOptions?.length === 0;

            const isSkippedFIB =
              result.type === "FIB" &&
              userAnswer &&
              (userAnswer.blankAnswers?.length === 0 ||
                userAnswer.blankAnswers.every((ans) => ans.trim() === ""));

            if (userAnswer && (isSkippedMCQMSQ || isSkippedFIB)) {
              return (
                <Chip
                  size="small"
                  sx={{
                    backgroundColor: "var(--delete-color)",
                    color: "var(--white)",
                    borderRadius: "4px",
                    height: "20px",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                  label="Skipped"
                />
              );
            }

            if (!userAnswer) {
              return (
                <Chip
                  size="small"
                  sx={{
                    backgroundColor: "var(--delete-color)",
                    color: "var(--white)",
                    borderRadius: "4px",
                    height: "20px",
                    fontSize: "10px",
                    fontWeight: 600,
                  }}
                  label="Unattempted"
                />
              );
            }

            return null;
          })()}

          {/* Show marks only? Or marks reveal correctness? Usually marks are okay but maybe hide if very strict? Assuming marks are OK for now as user asked about "Question and Correct Answer". */}
          <Chip
            label={userAnswer?.pMarkObtained || 0}
            size="small"
            sx={{
              backgroundColor: "var(--primary-color-acc-2)",
              color: "var(--primary-color)",
              borderRadius: "4px",
              height: "20px",
              fontSize: "10px",
              fontWeight: 600,
            }}
          />
          <Chip
            label={userAnswer?.nMarkObtained || 0}
            size="small"
            sx={{
              backgroundColor: "var(--sec-color-acc-1)",
              color: "var(--sec-color)",
              borderRadius: "4px",
              height: "20px",
              fontSize: "10px",
              fontWeight: 600,
            }}
          />
        </Stack>
      </Stack>

      <Box sx={{ "& p": { m: 0, fontSize: "14px" } }}>
        <MDPreview value={result.title} />
      </Box>

      <Stack gap="8px">
        {(result.type === "MCQ" || result.type === "MSQ") &&
          result.options.map((option, index) => {
            const isSelected = userAnswer?.selectedOptions?.includes(option.id);
            const correctOptionIds =
              answerInfo?.correct.map((opt) => opt.id) || [];

            // If showAnswers is false, act as if no option is correct for display purposes
            const isOptionCorrect = showAnswers
              ? correctOptionIds.includes(option.id)
              : false;

            let borderColor = "var(--border-color)";
            let label = "";
            let labelColor = "text.secondary";

            if (isSelected) {
              // If selected, we want to know if it's correct/incorrect only if showAnswers is true
              if (showAnswers) {
                if (isOptionCorrect) {
                  borderColor = "var(--primary-color)";
                  label = "Correct Answer";
                  labelColor = "var(--primary-color)";
                } else {
                  borderColor = "var(--delete-color)";
                  label = "Incorrect Answer";
                  labelColor = "var(--delete-color)";
                }
              } else {
                // Just show it was selected
                borderColor = "var(--primary-color)"; // Neutral or primary to show selection
                label = "Your Answer";
                labelColor = "var(--primary-color)";
              }
            } else if (isOptionCorrect && showAnswers) {
              // Show missed correct answers ONLY if showAnswers is true
              borderColor = "var(--primary-color)";
              label = "Correct Answer (Missed)";
              labelColor = "var(--primary-color)";
            }

            return (
              <Stack
                key={index}
                direction="row"
                gap="10px"
                sx={{
                  border: `1px solid ${borderColor}`,
                  padding: "8px 12px",
                  width: "100%",
                  borderRadius: "8px",
                  alignItems: "center",
                  bgcolor: isSelected ? "#f8fafc" : "transparent",
                }}
              >
                <Radio
                  checked={isSelected}
                  size="small"
                  sx={{
                    color: borderColor,
                    padding: "0px",
                    "&.Mui-checked": { color: borderColor },
                  }}
                />
                <Stack sx={{ width: "100%" }}>
                  <Box sx={{ "& p": { m: 0, fontSize: "13px" } }}>
                    <MDPreview value={option.text} />
                  </Box>
                  {label && (
                    <Typography
                      sx={{
                        fontFamily: "var(--font-geist-sans)",
                        fontSize: "10px",
                        fontWeight: "700",
                        color: labelColor,
                        mt: 0.5,
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            );
          })}

        {/* FIB Logic similar update */}
        {result.type === "FIB" &&
          answerInfo?.blanks.map((blank, index) => {
            const userResponse = userAnswer?.blankAnswers?.[index] || "";
            // Only show correctness coloring if showAnswers is true
            const isCorrect = showAnswers ? userAnswer?.isCorrect : true; // Default to neutral if hiding

            return (
              <Stack
                key={index}
                gap="4px"
                sx={{
                  border: `1px solid ${
                    showAnswers
                      ? isCorrect
                        ? "var(--primary-color)"
                        : "var(--delete-color)"
                      : "var(--border-color)"
                  }`,
                  padding: "8px 12px",
                  width: "100%",
                  borderRadius: "8px",
                  display: userResponse ? "flex" : "none",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "text.secondary",
                  }}
                >
                  Blank {index + 1}
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
                  Your Answer: {userResponse}
                </Typography>
              </Stack>
            );
          })}
      </Stack>

      {/* Only show solution accordion if showAnswers is true */}
      {showAnswers && (
        <Accordion
          expanded={expanded}
          onChange={handleToggle}
          sx={{
            boxShadow: "none",
            border: "none",
            "&::before": { display: "none" },
            bgcolor: "transparent",
            m: "0 !important",
          }}
        >
          <AccordionSummary
            sx={{
              minHeight: "auto",
              p: 0,
              "& .MuiAccordionSummary-content": { m: 0 },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap="6px"
              sx={{
                cursor: "pointer",
                color: "var(--primary-color)",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-geist-sans)",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {expanded ? "Hide Solution" : "View Solution"}
              </Typography>
              {expanded ? (
                <ExpandLess fontSize="small" color="inherit" />
              ) : (
                <ExpandMore fontSize="small" color="inherit" />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, pt: 1 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "#f1f5f9",
                borderRadius: "8px",
                fontSize: "13px",
                "& p": { m: 0 },
              }}
            >
              <MDPreview
                value={
                  answerList.find((ans) => ans.questionID === result.questionID)
                    ?.solution || "No solution provided."
                }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
