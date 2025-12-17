"use client";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import {
  Stack,
  Typography,
  useMediaQuery,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import Overview from "@/src/app/exam/Components/Overview";
import { useEffect, useState, useCallback } from "react";
import ResultSection from "@/src/Components/ResultSection/ResultSection";
import Loading from "./loading";

export default function Result() {
  const router = useRouter();
  const params = useParams();
  const [result, setResult] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswerList, setUserAnswerList] = useState([]);
  let questionIndex = 0;
  const isMobile = useMediaQuery("(max-width: 400px)");

  const fetchResult = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${params.id}/${params.attempt}/result`
      );
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setQuestionList(data.data.questions);
        setAnswerList(data.data.answerList);
        setUserAnswerList(data.data.userAnswers);
      } else {
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [params.id, params.attempt]);

  useEffect(() => {
    fetchResult();
  }, [fetchResult]);

  const viewResult = result?.settings?.isShowResult ?? true;
  const showAnswers = result?.settings?.showAnswers ?? true;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", pb: 4 }}>
      {isLoading && <Loading />}
      {!isLoading && (
        <Box sx={{ maxWidth: "1000px", mx: "auto", p: { xs: 2, md: 4 } }}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="center"
            gap={2}
            mb={3}
            sx={{ cursor: "pointer", width: "fit-content" }}
            onClick={() => router.push(`/dashboard?path=history`)}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "50%",
                bgcolor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
              }}
            >
              <ArrowBackIosNewRounded
                fontSize="small"
                sx={{ color: "var(--text1)" }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 700,
                color: "var(--text1)",
              }}
            >
              Back to History
            </Typography>
          </Stack>

          <Stack gap={3}>
            {/* 1. Exam Info Bar */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                bgcolor: "white",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", md: "center" }}
                gap={2}
              >
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "var(--font-geist-sans)",
                      color: "var(--text1)",
                      mb: 0.5,
                    }}
                  >
                    {result?.title || "Exam Result"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attempted on{" "}
                    {new Date(result?.startTimeStamp).toLocaleDateString()}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  gap={4}
                  divider={<Divider orientation="vertical" flexItem />}
                  sx={{
                    bgcolor: "#f8fafc",
                    p: 2,
                    borderRadius: "12px",
                    width: { xs: "100%", md: "auto" },
                    justifyContent: {
                      xs: "space-around",
                      md: "flex-start",
                    },
                  }}
                >
                  <Box textAlign="center">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Duration
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {result?.duration} min
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Questions
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {result?.totalQuestions}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Marks
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {result?.totalMarks}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>

            {/* 2. Overview Stats */}
            <Overview result={result} />

            {/* 3. Question Analysis (Conditional) */}
            {viewResult ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid var(--border-color)",
                  bgcolor: "white",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  Question Analysis
                </Typography>

                <Stack gap={4}>
                  {questionList.map((section, index) => {
                    const currentStartIndex = questionIndex;
                    questionIndex += section.questions.length;
                    return (
                      <ResultSection
                        key={index}
                        sections={section}
                        answerList={answerList}
                        userAnswerList={userAnswerList}
                        startIndex={currentStartIndex}
                        showAnswers={showAnswers}
                      />
                    );
                  })}
                </Stack>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: "16px",
                  border: "1px solid var(--border-color)",
                  bgcolor: "white",
                  textAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src="/icons/lock.svg" // Assuming a lock icon exists or use a placeholder
                  sx={{ width: 60, height: 60, mb: 2, opacity: 0.5 }}
                  onError={(e) => (e.target.style.display = "none")}
                />
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Detailed Results Hidden
                </Typography>
                <Typography color="text.secondary">
                  The administrator has disabled detailed result viewing for
                  this exam.
                </Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
