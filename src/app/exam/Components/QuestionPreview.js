"use client";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
}) {
  const [expanded, setExpanded] = useState(false);

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
        borderRadius: "10px",
        padding: "15px",
        minHeight: "200px",
        gap: "12px",
        width: "100%",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="10px">
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
        >
          Q {qNum}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--sec-color-acc-1)",
            color: "var(--sec-color)",
            height: "22px",
            textTransform: "none",
            fontSize: "10px",
            fontFamily: "Lato",
            gap: "10px",
          }}
          disableElevation
        >
          {result.type}
        </Button>

        <Stack flexDirection="row" gap="10px" sx={{ marginLeft: "auto" }}>
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
                    borderRadius: "5px",
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
                    borderRadius: "5px",
                  }}
                  label="Unattempted"
                />
              );
            }

            return null;
          })()}

          <Chip
            label={userAnswer?.pMarkObtained || 0}
            size="small"
            sx={{
              backgroundColor: "var(--primary-color-acc-2)",
              color: "var(--primary-color)",
              borderRadius: "5px",
            }}
          />
          <Chip
            label={userAnswer?.nMarkObtained || 0}
            size="small"
            sx={{
              backgroundColor: "var(--sec-color-acc-1)",
              color: "var(--sec-color)",
              borderRadius: "5px",
            }}
          />
        </Stack>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <MDPreview value={result.title} />
      </Stack>
      <Stack
        flexDirection="row"
        flexWrap="wrap"
        gap="20px"
        padding={{ xs: "0px", md: "10px" }}
      >
        {(result.type === "MCQ" || result.type === "MSQ") &&
          result.options.map((option, index) => {
            const isSelected = userAnswer?.selectedOptions?.includes(option.id);
            const correctOptionIds =
              answerInfo?.correct.map((opt) => opt.id) || [];
            const isOptionCorrect = correctOptionIds.includes(option.id);

            let borderColor = "var(--border-color)";
            let label = "";

            if (isSelected && isOptionCorrect) {
              borderColor = "var(--primary-color)";
              label = "Correct Answer";
            } else if (isSelected && !isOptionCorrect) {
              borderColor = "var(--delete-color)";
              label = "Incorrect Answer";
            } else if (!isSelected && isOptionCorrect) {
              borderColor = "var(--primary-color)";
              label = "Correct Answer (Missed)";
            }

            return (
              <Stack
                key={index}
                gap="10px"
                sx={{
                  border: `2px solid ${borderColor}`,
                  padding: "10px",
                  width: "520px",
                  minHeight: "90px",
                  borderRadius: "5px",
                  justifyContent: "center",
                }}
              >
                <Stack flexDirection="row" alignItems="center" gap="10px">
                  <Radio
                    checked={isSelected}
                    sx={{
                      color: borderColor,
                      padding: "0px",
                      "&.Mui-checked": { color: borderColor },
                    }}
                  />
                  <Stack gap="5px">
                    <MDPreview value={option.text} />
                    {label && (
                      <Typography
                        sx={{
                          fontFamily: "Lato",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: borderColor,
                        }}
                      >
                        {label}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            );
          })}

        {result.type === "FIB" &&
          answerInfo?.blanks.map((blank, index) => {
            const userResponse = userAnswer?.blankAnswers?.[index] || "";
            const isCorrect = userAnswer?.isCorrect;

            return (
              <Stack
                key={index}
                gap="4px"
                sx={{
                  border: `2px solid ${
                    isCorrect ? "var(--primary-color)" : "var(--delete-color)"
                  }`,
                  padding: "10px",
                  width: "520px",
                  minHeight: "80px",
                  borderRadius: "5px",
                  justifyContent: "center",
                  display: userResponse ? "flex" : "none",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  Blank {index + 1}
                </Typography>
                <MDPreview value={`Your Answer : ${userResponse}`} />
              </Stack>
            );
          })}
      </Stack>
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="5px"
        sx={{ cursor: "pointer" }}
        onClick={() => {}}
      >
        <Accordion
          expanded={expanded}
          sx={{
            boxShadow: "none",
            border: "none",
            "&::before": { display: "none" },
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <AccordionSummary
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              gap="10px"
              onClick={handleToggle}
              sx={{ transition: "all 0.7s ease" }}
            >
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                View Solution
              </Typography>
              {expanded ? (
                <ExpandLess sx={{ color: "var(--text2)" }} />
              ) : (
                <ExpandMore sx={{ color: "var(--text2)" }} />
              )}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <MDPreview
              value={
                answerList.find((ans) => ans.questionID === result.questionID)
                  .solution
              }
            />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Stack>
  );
}
