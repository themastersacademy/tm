"use client";
import { Badge, Box, Button, Divider, Stack, Typography } from "@mui/material";
import ExamQuestionCard from "../../Components/ExamQuestionCard";
import ExamHeader from "../../Components/ExamHeader";
import MobileSectionDraw from "../../Components/MobileSectionDraw";
import ExamSection from "../../Components/ExamSection";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { usePreventNavigation } from "../../Components/use-prevent-navigation";
import NavigationGuard from "../../Components/NavigationGuard";
import { Bookmark, Fullscreen } from "@mui/icons-material";
import LoadingComp from "../../Components/LoadingComp";
import { enqueueSnackbar } from "notistack";

export default function Exam() {
  const router = useRouter();
  const params = useParams();
  const examID = params.id;
  const attemptID = params.attempt;
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [serverTimestamp, setServerTimestamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientPerfAtFetch, setClientPerfAtFetch] = useState(null);
  const [isFsEnabled, setIsFsEnabled] = useState(false);
  const [questionState, setQuestionState] = useState({
    selectedSectionIndex: 0,
    selectedQuestionIndex: 0,
    questionNo: 1,
    sectionViseQuestionCount: [],
  });
  const [userAnswers, setUserAnswers] = useState([]);

  const { showDialog, confirmNavigation, cancelNavigation } =
    usePreventNavigation(true);

  const now = () => {
    const elapsed = performance.now() - clientPerfAtFetch;
    return serverTimestamp + elapsed;
  };

  const handleEndTest = useCallback(
    (endedBy = "USER") => {
      enqueueSnackbar("Submitting exam", {
        variant: "loading",
      });
      console.log(endedBy);
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${examID}/${attemptID}/submit-exam`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endedBy,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            router.push(`/exam/${examID}/${attemptID}/result`);
          } else {
            console.log("Exam submission failed");
          }
        });
    },
    [examID, attemptID, router]
  );

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${examID}/${attemptID}`
      );
      const data = await res.json();

      if (data.success) {
        const attemptInfo = data.data;
        if (attemptInfo.status === "IN_PROGRESS") {
          setExamData(attemptInfo);
          setUserAnswers(attemptInfo.userAnswers);
          setServerTimestamp(attemptInfo.serverTimestamp);
          setClientPerfAtFetch(performance.now());
          // const timeLimit =
          //   attemptInfo.startTimeStamp + attemptInfo.duration * 1000 * 60;
          // const remainingTime = timeLimit - now();
          // if (remainingTime <= 0) {
          //   handleEndTest("AUTO");
          // }
          await fetch(`${attemptInfo.blobSignedUrl}`).then((res) =>
            res
              .json()
              .then((data) => {
                setLoading(false);
                setQuestions(data);
              })
              .catch(() => {
                handleEndTest("AUTO");
              })
          );
        } else if (attemptInfo.status === "COMPLETED") {
          enqueueSnackbar("Exam already ended", {
            variant: "error",
          });
          router.push(`/exam/${examID}/${attemptID}/result`);
        }
      } else {
        enqueueSnackbar("Exam not found", {
          variant: "error",
        });
        router.push(`/dashboard`);
      }
    } catch (err) {
      console.error("Error fetching exam or blob data:", err);
    }
  }, [examID, attemptID, handleEndTest, router]);

  useEffect(() => {
    const onFsChange = () => setIsFsEnabled(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    setQuestionState((prev) => ({
      ...prev,
      sectionViseQuestionCount: questions?.sections?.map(
        (section) => section.questions.length
      ),
    }));
  }, [questions]);

  const getUserAnswer = useCallback(
    (questionID) => {
      return userAnswers.find((answer) => answer.questionID === questionID);
    },
    [userAnswers]
  );

  useEffect(() => {
    const questionID =
      questions?.sections?.[questionState.selectedSectionIndex]?.questions?.[
        questionState.selectedQuestionIndex
      ]?.questionID;
    if (!getUserAnswer(questionID) && questionID) {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${examID}/${attemptID}/view-question`,
        {
          method: "POST",
          body: JSON.stringify({ questionID }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserAnswers(data.data);
            setClientPerfAtFetch(performance.now());
            setServerTimestamp(data.serverTimestamp);
          } else {
            router.push(`/exam/${examID}/${attemptID}/result`);
          }
        });
    }
  }, [
    getUserAnswer,
    questionState,
    questions?.sections,
    examID,
    attemptID,
    userAnswers,
    router,
  ]);

  const updateUserAnswer = (questionID, job, userAnswer) => {
    console.log(userAnswer);
    const { selectedOptions, blankAnswers, timeSpentMs, markedForReview } =
      userAnswer;
    if (job === "blankAnswers" || job === "selectedOptions") {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${examID}/${attemptID}/question-response`,
        {
          method: "POST",
          body: JSON.stringify({
            questionID,
            selectedOptions:
              job === "selectedOptions" ? selectedOptions : undefined,
            blankAnswers: job === "blankAnswers" ? blankAnswers : undefined,
            timeSpentMs,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserAnswers(data.data);
            setClientPerfAtFetch(performance.now());
            setServerTimestamp(data.serverTimestamp);
          } else {
            router.push(`/exam/${examID}/${attemptID}/result`);
          }
        });
    } else if (job === "markedForReview") {
      fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${examID}/${attemptID}/mark-unmark-question`,
        {
          method: "POST",
          body: JSON.stringify({ questionID, bookmarked: markedForReview }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUserAnswers(data.data);
          setClientPerfAtFetch(performance.now());
          setServerTimestamp(data.serverTimestamp);
        });
    }
  };

  const handleQuestionSelection = ({ sectionIndex, questionIndex }) => {
    setQuestionState((prev) => ({
      ...prev,
      selectedSectionIndex: sectionIndex,
      selectedQuestionIndex: questionIndex,
      questionNo:
        questions?.sections?.reduce((acc, section, i) => {
          if (i < sectionIndex) {
            return acc + section.questions.length;
          }
          return acc;
        }, 0) +
        questionIndex +
        1,
    }));
  };

  const handleOnNextQuestion = () => {
    const sections = questions?.sections || [];
    const sectionCount = sections.length;
    const {
      selectedSectionIndex: secIdx,
      selectedQuestionIndex: qIdx,
      questionNo,
    } = questionState;

    const currentQuestions = sections[secIdx]?.questions || [];
    const questionCount = currentQuestions.length;

    const isLastQuestionInSection = qIdx === questionCount - 1;
    const isLastSection = secIdx === sectionCount - 1;

    // 1) Move within the same section
    if (!isLastQuestionInSection) {
      setQuestionState((prev) => ({
        ...prev,
        selectedQuestionIndex: prev.selectedQuestionIndex + 1,
        questionNo: prev.questionNo + 1,
      }));

      // 2) Jump to first question of next section
    } else if (!isLastSection) {
      setQuestionState((prev) => ({
        ...prev,
        selectedSectionIndex: prev.selectedSectionIndex + 1,
        selectedQuestionIndex: 0,
        questionNo: prev.questionNo + 1,
      }));
    }

    // 3) else: you’re already on the very last question of the last section → no-op
  };

  const handleOnPreviousQuestion = () => {
    const sections = questions?.sections || [];
    const {
      selectedSectionIndex: secIdx,
      selectedQuestionIndex: qIdx,
      questionNo,
    } = questionState;

    // 1) Move within the same section (if not at first question)
    if (qIdx > 0) {
      setQuestionState((prev) => ({
        ...prev,
        selectedQuestionIndex: prev.selectedQuestionIndex - 1,
        questionNo: prev.questionNo - 1,
      }));

      // 2) Jump to last question of previous section
    } else if (secIdx > 0) {
      const prevSectionQuestions = sections[secIdx - 1]?.questions || [];
      const lastIndex = prevSectionQuestions.length - 1;

      setQuestionState((prev) => ({
        ...prev,
        selectedSectionIndex: prev.selectedSectionIndex - 1,
        selectedQuestionIndex: lastIndex,
        questionNo: prev.questionNo - 1,
      }));
    }

    // 3) else: you’re at the very first question of the first section → no-op
  };

  function toggleFullScreen() {
    // First, check if fullscreen is supported
    const docEl = document.documentElement;
    const fsEnabled =
      docEl.requestFullscreen ||
      document.fullscreenEnabled ||
      docEl.webkitRequestFullscreen || // Safari
      docEl.msRequestFullscreen; // IE/Edge

    if (!fsEnabled) {
      console.warn("Fullscreen not enabled or supported by this browser");
      return;
    }

    if (!document.fullscreenElement) {
      // Enter fullscreen
      const request =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.msRequestFullscreen;
      if (request) {
        request.call(docEl);
      }
    } else {
      // Exit fullscreen
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      if (exit) {
        exit.call(document);
      }
    }
  }

  if (loading) {
    return <LoadingComp />;
  }

  return (
    <Stack
      sx={{
        backgroundColor: "var(--sec-color-acc-2)",
        minHeight: "100vh",
        overflow: "auto",
        pt: "60px",
      }}
    >
      <Stack
        sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
      >
        <ExamHeader
          examData={examData}
          isFsEnabled={isFsEnabled}
          now={now}
          toggleFullScreen={toggleFullScreen}
          handleEndTest={handleEndTest}
        />
      </Stack>
      <NavigationGuard
        isOpen={showDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <Stack flexDirection="row" position="relative" width="100%" height="100%">
        {questions.settings.isFullScreenMode && !isFsEnabled && (
          <FullscreenPrompt onEnable={toggleFullScreen} />
        )}
        <Stack
          sx={{
            padding: { xs: "12px", md: "30px" },
            width: { xs: "100%", md: "70%" },
            gap: "20px",
            zIndex: 0,
          }}
        >
          <ExamQuestionCard
            questions={questions?.sections}
            questionState={questionState}
            pMark={
              questions?.sections?.[questionState.selectedSectionIndex]?.pMark
            }
            nMark={
              questions?.sections?.[questionState.selectedSectionIndex]?.nMark
            }
            userAnswer={getUserAnswer(
              questions?.sections?.[questionState.selectedSectionIndex]
                ?.questions?.[questionState.selectedQuestionIndex]?.questionID
            )}
            updateUserAnswer={updateUserAnswer}
            handleOnNextQuestion={handleOnNextQuestion}
            handleOnPreviousQuestion={handleOnPreviousQuestion}
          />
          <MobileSectionDraw
            handleOnNextQuestion={handleOnNextQuestion}
            handleOnPreviousQuestion={handleOnPreviousQuestion}
          >
            <SectionComponent
              questions={questions}
              questionState={questionState}
              handleQuestionSelection={handleQuestionSelection}
              userAnswers={userAnswers}
            />
          </MobileSectionDraw>
          <AsideComponent
            questions={questions}
            questionState={questionState}
            handleQuestionSelection={handleQuestionSelection}
            userAnswers={userAnswers}
          >
            <SectionComponent
              questions={questions}
              questionState={questionState}
              handleQuestionSelection={handleQuestionSelection}
              userAnswers={userAnswers}
              handleOnNextQuestion={handleOnNextQuestion}
              handleOnPreviousQuestion={handleOnPreviousQuestion}
            />
          </AsideComponent>
        </Stack>
      </Stack>
    </Stack>
  );
}

function FullscreenPrompt({ onEnable }) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(255, 255, 255, 0.4)", // dark overlay
        backdropFilter: "blur(10px)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: 360, md: 400 },
          bgcolor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "var(--primary-color)" }}
        >
          Full Screen Required
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--text3)", mb: 3 }}>
          For the best experience please enable full-screen mode before
          proceeding.
        </Typography>
        <Button
          variant="contained"
          onClick={onEnable}
          startIcon={<Fullscreen />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            background: "var(--sec-color)",
            color: "#000",
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          Enable Full Screen
        </Button>
      </Box>
    </Box>
  );
}

function AsideComponent({ children }) {
  return (
    <Stack
      sx={{
        padding: "20px",
        width: "350px",
        backgroundColor: "var(--white)",
        display: { xs: "none", md: "block" },
        marginLeft: "auto",
        position: "fixed",
        top: "60px",
        right: "0",
        height: "calc(100vh - 60px)",
        zIndex: 0,
        overflowY: "auto",
      }}
    >
      {children}
    </Stack>
  );
}

function SectionComponent({
  questions,
  questionState,
  handleQuestionSelection,
  userAnswers,
}) {
  return (
    <>
      <AnswerStateIndicator />
      <Divider sx={{ margin: "20px 10px 0 10px" }} />
      <Stack gap="10px" mt="10px" mb="10px">
        {questions?.sections?.map((section, i) => (
          <ExamSection
            key={i}
            sectionIndex={i}
            title={section.title}
            questions={section}
            questionState={questionState}
            handleQuestionSelection={handleQuestionSelection}
            userAnswers={userAnswers}
          />
        ))}
      </Stack>
    </>
  );
}

function AnswerStateIndicator() {
  return (
    <Stack width="100%" gap="15px">
      <Stack flexDirection="row" gap="10px" alignItems="center" width="100%">
        <Stack flexDirection="row" gap="10px" alignItems="center" width="50%">
          <Stack
            sx={{
              width: 24,
              height: 24,
              bgcolor: "var(--primary-color-acc-1)",
              borderRadius: "50%",
            }}
          ></Stack>
          <Typography sx={{ fontSize: "14px" }}>Answered</Typography>
        </Stack>
        <Stack flexDirection="row" gap="10px" alignItems="center" width="50%">
          <Badge
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
            sx={{
              bgcolor: "var(--sec-color)",
              borderRadius: "50%",
            }}
          >
            <Stack
              sx={{
                width: 24,
                height: 24,
                bgcolor: "var(--white)",
                border: "1px solid var(--border-color)",
                borderRadius: "50%",
              }}
            ></Stack>
          </Badge>
          <Typography sx={{ fontSize: "14px" }}>Marked</Typography>
        </Stack>
      </Stack>
      <Stack flexDirection="row" gap="10px" alignItems="center" width="100%">
        <Stack flexDirection="row" gap="10px" alignItems="center" width="50%">
          <Stack
            sx={{
              width: 24,
              height: 24,
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
            }}
          ></Stack>
          <Typography sx={{ fontSize: "14px" }}>Not Visited</Typography>
        </Stack>
        <Stack flexDirection="row" gap="10px" alignItems="center" width="50%">
          <Stack
            sx={{
              width: 24,
              height: 24,
              bgcolor: "var(--delete-color-acc-1)",
              borderRadius: "50%",
            }}
          ></Stack>
          <Typography sx={{ fontSize: "14px" }}>Unanswered</Typography>
        </Stack>
      </Stack>
      <Stack flexDirection="row" gap="10px" alignItems="center" width="100%">
        <Stack flexDirection="row" gap="10px" alignItems="center" width="100%">
          <Badge
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
            sx={{
              bgcolor: "var(--sec-color)",
              borderRadius: "50%",
            }}
          >
            <Stack
              sx={{
                width: 24,
                height: 24,
                bgcolor: "var(--primary-color-acc-1)",
                borderRadius: "50%",
              }}
            ></Stack>
          </Badge>
          <Typography sx={{ fontSize: "14px" }}>Marked & Answered</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
