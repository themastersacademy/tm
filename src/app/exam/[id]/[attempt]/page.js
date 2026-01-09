"use client";
import {
  Badge,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useDebouncedCallback } from "use-debounce"; // Check if this exists, otherwise use custom
import _ from "lodash";
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
import { seededShuffle } from "@/src/utils/seededShuffle";
import AntiCheatToast from "../../Components/AntiCheatToast";
import ViolationDialog from "../../Components/ViolationDialog";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const { showDialog, confirmNavigation, cancelNavigation } =
    usePreventNavigation(true);

  const now = () => {
    const elapsed = performance.now() - clientPerfAtFetch;
    return serverTimestamp + elapsed;
  };

  const submitExam = useCallback(
    (endedBy) => {
      setIsSubmitting(true);
      fetch(`/api/exams/${examID}/${attemptID}/submit-exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endedBy,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            router.push(`/exam/${examID}/${attemptID}/result`);
            if (document.fullscreenElement) {
              toggleFullScreen();
            }
          } else {
            setIsSubmitting(false);
            enqueueSnackbar("Exam submission failed", { variant: "error" });
          }
        })
        .catch(() => {
          setIsSubmitting(false);
          enqueueSnackbar("Something went wrong", { variant: "error" });
        });
    },
    [examID, attemptID, router]
  );

  const handleEndTest = useCallback(
    (endedBy = "USER") => {
      if (endedBy === "USER") {
        setShowSubmitDialog(true);
      } else {
        setIsTimeUp(true);
        submitExam(endedBy);
      }
    },
    [submitExam]
  );

  const [error, setError] = useState(null);

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await fetch(`/api/exams/${examID}/${attemptID}`);
      const data = await res.json();

      if (data.success) {
        const attemptInfo = data.data;
        if (attemptInfo.status === "IN_PROGRESS") {
          setExamData(attemptInfo);
          setUserAnswers(attemptInfo.userAnswers);
          setServerTimestamp(attemptInfo.serverTimestamp);
          setClientPerfAtFetch(performance.now());
          await fetch(`${attemptInfo.blobSignedUrl}`)
            .then((res) => {
              if (!res.ok) throw new Error("Failed to load question data");
              return res.json();
            })
            .then((data) => {
              if (attemptInfo.seed != null) {
                const seed = attemptInfo.seed.toString();
                data.sections = data.sections.map((section, index) => ({
                  ...section,
                  questions: seededShuffle(section.questions, `${seed}`),
                }));
              }
              setQuestions(data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Blob fetch error:", err);
              setError(
                "Failed to load exam content. Please check your connection."
              );
              setLoading(false);
            });
        } else if (attemptInfo.status === "COMPLETED") {
          router.push(`/exam/${examID}/${attemptID}/result`);
        }
      } else {
        setError(data.message || "Failed to load exam details");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching exam or blob data:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }, [examID, attemptID, router]);

  useEffect(() => {
    const onFsChange = () => setIsFsEnabled(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Anti-Cheat Implementation
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationDialog, setShowViolationDialog] = useState(false);

  // Initialize violation count from server
  useEffect(() => {
    if (examData?.violationCount) {
      setViolationCount(examData.violationCount);
      // Immediately enforce termination if limit passed
      if (examData.violationCount >= 3) {
        // Show specific message or just auto submit
        setIsSubmitting(true); // Block UI
        submitExam("AUTO");
      }
    }
  }, [examData, submitExam]);

  const reportViolation = useCallback(
    async (newCount) => {
      try {
        await fetch(`/api/exams/${examID}/${attemptID}/report-violation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: newCount }),
        });
      } catch (error) {
        console.error("Failed to report violation:", error);
      }
    },
    [examID, attemptID]
  );

  useEffect(() => {
    if (!questions?.settings?.isAntiCheat) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      enqueueSnackbar("Right-click is disabled during the exam.", {
        variant: "warning",
      });
    };

    const handleCopyCutPaste = (e) => {
      e.preventDefault();
      enqueueSnackbar("Copy/Paste is disabled during the exam.", {
        variant: "warning",
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationCount((prev) => {
          const newCount = prev + 1;
          reportViolation(newCount);
          return newCount;
        });
        setShowViolationDialog(true);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyCutPaste);
    document.addEventListener("cut", handleCopyCutPaste);
    document.addEventListener("paste", handleCopyCutPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [questions?.settings?.isAntiCheat, reportViolation]);

  const handleViolationDialogClose = () => {
    if (violationCount >= 3) {
      handleEndTest("AUTO");
    }
    setShowViolationDialog(false);
  };

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
      fetch(`/api/exams/${examID}/${attemptID}/view-question`, {
        method: "POST",
        body: JSON.stringify({ questionID }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserAnswers((prev) => {
              const newQuestionData = data.data.find(
                (q) => q.questionID === questionID
              );
              if (!newQuestionData) return prev;

              const idx = prev.findIndex((q) => q.questionID === questionID);
              if (idx !== -1) {
                const newArr = [...prev];
                newArr[idx] = newQuestionData;
                return newArr;
              }
              return [...prev, newQuestionData];
            });
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

  // Optimistic update helper
  const updateLocalUserAnswer = (questionID, job, value) => {
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex(
        (ans) => ans.questionID === questionID
      );

      // If not found, create a new entry locally
      if (existingIndex === -1) {
        const newAnswer = {
          questionID,
          selectedOptions: job === "selectedOptions" ? value : [],
          blankAnswers: job === "blankAnswers" ? value : [],
          markedForReview: job === "markedForReview" ? value : false,
          timeSpentMs: 0,
        };
        return [...prev, newAnswer];
      }

      const newAnswers = [...prev];
      const currentAnswer = { ...newAnswers[existingIndex] };

      if (job === "selectedOptions") {
        currentAnswer.selectedOptions = value;
      } else if (job === "blankAnswers") {
        currentAnswer.blankAnswers = value;
      } else if (job === "markedForReview") {
        currentAnswer.markedForReview = value;
      }

      newAnswers[existingIndex] = currentAnswer;
      return newAnswers;
    });
  };

  // Debounced Save Function
  const debouncedSave = useCallback(
    _.debounce(
      (questionID, job, selectedOptions, blankAnswers, timeSpentMs) => {
        fetch(`/api/exams/${examID}/${attemptID}/question-response`, {
          method: "POST",
          body: JSON.stringify({
            questionID,
            selectedOptions:
              job === "selectedOptions" ? selectedOptions : undefined,
            blankAnswers: job === "blankAnswers" ? blankAnswers : undefined,
            timeSpentMs,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setClientPerfAtFetch(performance.now());
              setServerTimestamp(data.serverTimestamp);
            } else {
              // Ideally revert optimistic update here if needed, or notify
              // router.push(`/exam/${examID}/${attemptID}/result`); // Maybe too aggressive to kick out?
            }
          });
      },
      500
    ), // 500ms debounce
    [examID, attemptID]
  );

  const updateUserAnswer = (questionID, job, userAnswer) => {
    const { selectedOptions, blankAnswers, timeSpentMs, markedForReview } =
      userAnswer;

    // Optimistic Update
    if (job === "selectedOptions") {
      updateLocalUserAnswer(questionID, job, selectedOptions);
    } else if (job === "blankAnswers") {
      updateLocalUserAnswer(questionID, job, blankAnswers);
    } else if (job === "markedForReview") {
      updateLocalUserAnswer(questionID, job, markedForReview);
    }

    if (job === "blankAnswers" || job === "selectedOptions") {
      debouncedSave(
        questionID,
        job,
        selectedOptions,
        blankAnswers,
        timeSpentMs
      );
    } else if (job === "markedForReview") {
      // Mark for review usually doesn't need heavy debouncing but good to be consistent?
      // Existing logic was direct fetch. Let's keep it direct or maybe debounce slightly?
      // Keeping direct for now as it's a toggle.
      fetch(`/api/exams/${examID}/${attemptID}/mark-unmark-question`, {
        method: "POST",
        body: JSON.stringify({ questionID, bookmarked: markedForReview }),
      })
        .then((res) => res.json())
        .then((data) => {
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

  const handleOnNextQuestion = useCallback(() => {
    const sections = questions?.sections || [];
    const sectionCount = sections.length;
    const { selectedSectionIndex: secIdx, selectedQuestionIndex: qIdx } =
      questionState;

    const currentQuestions = sections[secIdx]?.questions || [];
    const questionCount = currentQuestions.length;

    const isLastQuestionInSection = qIdx === questionCount - 1;
    const isLastSection = secIdx === sectionCount - 1;

    if (!isLastQuestionInSection) {
      setQuestionState((prev) => ({
        ...prev,
        selectedQuestionIndex: prev.selectedQuestionIndex + 1,
        questionNo: prev.questionNo + 1,
      }));
    } else if (!isLastSection) {
      setQuestionState((prev) => ({
        ...prev,
        selectedSectionIndex: prev.selectedSectionIndex + 1,
        selectedQuestionIndex: 0,
        questionNo: prev.questionNo + 1,
      }));
    }
  }, [questions, questionState]);

  const handleOnPreviousQuestion = useCallback(() => {
    const sections = questions?.sections || [];
    const { selectedSectionIndex: secIdx, selectedQuestionIndex: qIdx } =
      questionState;

    if (qIdx > 0) {
      setQuestionState((prev) => ({
        ...prev,
        selectedQuestionIndex: prev.selectedQuestionIndex - 1,
        questionNo: prev.questionNo - 1,
      }));
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
  }, [questions, questionState]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleOnNextQuestion();
      } else if (e.key === "ArrowLeft") {
        handleOnPreviousQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOnNextQuestion, handleOnPreviousQuestion]);

  function toggleFullScreen() {
    const docEl = document.documentElement;
    const fsEnabled =
      docEl.requestFullscreen ||
      document.fullscreenEnabled ||
      docEl.webkitRequestFullscreen ||
      docEl.msRequestFullscreen;

    if (!fsEnabled) {
      console.warn("Fullscreen not enabled or supported by this browser");
      return;
    }

    if (!document.fullscreenElement) {
      const request =
        docEl.requestFullscreen ||
        docEl.webkitRequestFullscreen ||
        docEl.msRequestFullscreen;
      if (request) {
        request.call(docEl);
      }
    } else {
      const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      if (exit) {
        exit.call(document);
      }
    }
  }

  if (error) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh", p: 4, textAlign: "center" }}
        gap={2}
      >
        <Typography variant="h5" color="error" fontWeight={600}>
          Connection Error
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchQuestion();
          }}
          sx={{ textTransform: "none", borderRadius: "8px" }}
        >
          Retry
        </Button>
      </Stack>
    );
  }

  if (loading) {
    return <LoadingComp />;
  }

  return (
    <Stack
      sx={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        height: "100vh",
        overflow: "hidden",
        userSelect: questions?.settings?.isAntiCheat ? "none" : "auto",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: "60px",
          flexShrink: 0,
          zIndex: 1200,
          bgcolor: "white",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <ExamHeader
          examData={examData}
          isFsEnabled={isFsEnabled}
          now={now}
          toggleFullScreen={toggleFullScreen}
          handleEndTest={handleEndTest}
        />
      </Box>

      <NavigationGuard
        isOpen={showDialog}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />

      <ViolationDialog
        open={showViolationDialog}
        onClose={handleViolationDialogClose}
        count={violationCount}
        maxCount={3}
        message={
          violationCount >= 3
            ? "Exam auto-submitted due to multiple security violations."
            : "Tab switching is prohibited. Continued violations will result in exam termination."
        }
      />

      {/* Submit Dialog */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={isSubmitting && !isTimeUp}
      >
        <Stack alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
          <Typography variant="h6">Submitting your exam...</Typography>
        </Stack>
      </Backdrop>

      {/* Time Up Dialog */}
      {isTimeUp && (
        <TimeUpDialog
          isSubmitting={isSubmitting}
          onRetry={() => submitExam("AUTO")}
        />
      )}

      {showSubmitDialog && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            backdropFilter: "blur(4px)",
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: "20px",
              p: 4,
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, color: "var(--text1)" }}
            >
              Submit Exam?
            </Typography>
            <Typography sx={{ color: "var(--text3)", mb: 4 }}>
              Are you sure you want to submit? You won&apos;t be able to change
              your answers after this.
            </Typography>

            <Stack direction="row" gap={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowSubmitDialog(false)}
                sx={{
                  borderRadius: "10px",
                  height: "48px",
                  borderColor: "var(--border-color)",
                  color: "var(--text2)",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => submitExam("USER")}
                sx={{
                  borderRadius: "10px",
                  height: "48px",
                  bgcolor: "var(--primary-color)",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "var(--primary-color-dark)" },
                }}
              >
                Submit Now
              </Button>
            </Stack>
          </Box>
        </Box>
      )}

      {questions.settings.isFullScreenMode && !isFsEnabled && (
        <FullscreenPrompt onEnable={toggleFullScreen} />
      )}

      {/* Main Content - Split Screen */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          flex: 1,
          overflow: "hidden",
          height: "calc(100vh - 60px)",
          position: "relative",
        }}
      >
        {/* Left: Question Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "center",
            bgcolor: "#f8fafc",
            minWidth: 0, // Prevent flex item from overflowing
          }}
        >
          <Box sx={{ width: "100%", maxWidth: "900px" }}>
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
          </Box>
        </Box>

        {/* Right: Palette (Desktop) */}
        <Box
          sx={{
            width: "320px",
            minWidth: "320px", // Force width
            borderLeft: "1px solid var(--border-color)",
            bgcolor: "white",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            overflow: "hidden",
            height: "100%",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid var(--border-color)",
              bgcolor: "var(--primary-color-acc-2)",
            }}
          >
            <Typography sx={{ fontWeight: 700, color: "var(--primary-color)" }}>
              Question Palette
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <SectionComponent
              questions={questions}
              questionState={questionState}
              handleQuestionSelection={handleQuestionSelection}
              userAnswers={userAnswers}
            />
          </Box>
        </Box>

        {/* Mobile Drawer */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <MobileSectionDraw
            handleOnNextQuestion={handleOnNextQuestion}
            handleOnPreviousQuestion={handleOnPreviousQuestion}
            questionState={questionState}
          >
            <SectionComponent
              questions={questions}
              questionState={questionState}
              handleQuestionSelection={handleQuestionSelection}
              userAnswers={userAnswers}
            />
          </MobileSectionDraw>
        </Box>
      </Box>
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
                bgcolor: "var(--white)",
                border: "1px solid var(--border-color)",
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

function TimeUpDialog({ isSubmitting, onRetry }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.8)",
        zIndex: 1400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "20px",
          p: 4,
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1, color: "var(--delete-color)" }}
        >
          Time&apos;s Up!
        </Typography>
        <Typography sx={{ color: "var(--text3)", mb: 4 }}>
          Your exam time has ended. We are submitting your answers.
        </Typography>

        {isSubmitting ? (
          <Stack alignItems="center" gap={2}>
            <CircularProgress
              size={30}
              sx={{ color: "var(--primary-color)" }}
            />
            <Typography variant="body2" sx={{ color: "var(--text2)" }}>
              Submitting...
            </Typography>
          </Stack>
        ) : (
          <Stack gap={2}>
            <Typography
              variant="body2"
              sx={{ color: "var(--delete-color)", fontWeight: 600 }}
            >
              Submission Failed. Please retry.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={onRetry}
              sx={{
                borderRadius: "10px",
                height: "48px",
                bgcolor: "var(--primary-color)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "var(--primary-color-dark)" },
              }}
            >
              Retry Submission
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
