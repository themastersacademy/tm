import { Box, Stack, Typography, Divider } from "@mui/material";
import QuestionPreview from "@/src/app/exam/Components/QuestionPreview";

export default function ResultSection({
  sections,
  answerList,
  userAnswerList,
  startIndex,
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={2} mb={2}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "var(--text1)",
            fontFamily: "var(--font-geist-sans)",
            bgcolor: "#f1f5f9",
            px: 2,
            py: 0.5,
            borderRadius: "8px",
          }}
        >
          {sections.title}
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>

      <Stack gap={3}>
        {sections.questions.map((question, index) => (
          <QuestionPreview
            key={index}
            qNum={startIndex + index + 1}
            result={question}
            userAnswerList={userAnswerList}
            answerList={answerList}
          />
        ))}
      </Stack>
    </Box>
  );
}
