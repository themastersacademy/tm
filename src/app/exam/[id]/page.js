"use client";
import MasterLogo from "@/src/Components/SideNav/MasterLogo";
import StatisticCard from "@/src/Components/StatisticCard/StatisticCard";
import { Close, East, AlarmRounded, Lock } from "@mui/icons-material";
import {
  Button,
  Stack,
  Typography,
  Box,
  Card,
  Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import practice from "@/public/icons/practice.svg";
import hours from "@/public/icons/hours.svg";
import sections from "@/public/icons/sections.svg";
import bookmark from "@/public/icons/bookmark.svg";
import { useEffect, useState } from "react";
import Compatibility from "../Components/Compatibility";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import Link from "next/link";
import Image from "next/image";
import CountDownTimer from "../Components/CountDownTimer";
import KnowYourTest from "../Components/KnowYourTest";
import InstructionLoading from "../Components/InstructionLoading";
import { useSession } from "next-auth/react";

export default function ExamInstruction() {
  const { data: session } = useSession();
  const isPro = session?.user?.accountType === "PRO";
  const router = useRouter();
  const [instruction, setInstruction] = useState([]);
  const params = useParams();
  const id = params.id;
  const [clientPerfAtFetch, setClientPerfAtFetch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  const now = () => {
    const elapsed = performance.now() - clientPerfAtFetch;
    return instruction.serverTimestamp + elapsed;
  };

  const fetchInstruction = async () => {
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${id}`).then(
        (res) =>
          res.json().then((data) => {
            setClientPerfAtFetch(performance.now());
            if (data.success) {
              setInstruction(data.data);
              setIsLoading(false);
            }
          })
      );
    } catch (error) {
      console.error("Error fetching instruction:", error);
    }
  };

  useEffect(() => {
    fetchInstruction();
  }, []);

  const startExam = async () => {
    if (instruction.activeAttempt) {
      router.push(`/exam/${id}/${instruction.activeAttempt.id}`);
      return;
    }
    setIsStarting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${id}/start`
      )
        .then((res) => res.json())
        .then((data) => {
          closeSnackbar();
          if (data.success) {
            enqueueSnackbar("Exam started successfully", {
              variant: "success",
            });
            router.push(`/exam/${id}/${data.data.attemptID}`);
          } else {
            setIsStarting(false);
            enqueueSnackbar(data.message, {
              variant: "error",
            });
          }
        });
    } catch (error) {
      setIsStarting(false);
      console.error("Error starting exam:", error);
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return <InstructionLoading />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 4 },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(254,168,0,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(254,168,0,0.08) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          gap: 2,
          backdropFilter: "blur(5px)",
          background: "rgba(0, 0, 0, 0.7)",
        }}
        open={isStarting}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Preparing your exam environment...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Please wait while we set things up for you.
        </Typography>
      </Backdrop>

      <Card
        elevation={0}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "800px",
          borderRadius: "20px",
          overflow: "visible",
          boxShadow: "0px 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(255,255,255,0.1)",
          mb: 2,
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            borderBottom: "1px solid var(--border-color)",
            bgcolor: "white",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
          }}
        >
          <MasterLogo />
          <Box
            onClick={() => !isStarting && router.back()}
            sx={{
              cursor: isStarting ? "not-allowed" : "pointer",
              p: 0.5,
              borderRadius: "50%",
              transition: "all 0.2s",
              opacity: isStarting ? 0.5 : 1,
              "&:hover": {
                bgcolor: !isStarting && "var(--primary-color-acc-2)",
                transform: !isStarting && "rotate(90deg)",
              },
            }}
          >
            <Close sx={{ color: "var(--text3)" }} />
          </Box>
        </Stack>

        {/* Content */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            bgcolor: "white",
          }}
        >
          <Stack alignItems="center" gap={3}>
            {/* Header Section with Icon & Title */}
            <Stack direction="row" alignItems="center" gap={2} width="100%">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px var(--primary-color-acc-1)",
                  flexShrink: 0,
                }}
              >
                <AlarmRounded sx={{ fontSize: 30, color: "white" }} />
              </Box>

              <Stack gap={0.5} flex={1}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: { xs: "20px", md: "24px" },
                    fontWeight: 700,
                    color: "var(--text1)",
                    lineHeight: 1.2,
                  }}
                >
                  {instruction.title}
                </Typography>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text3)",
                      bgcolor: "var(--primary-color-acc-2)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <AlarmRounded
                      sx={{ fontSize: 14, color: "var(--primary-color)" }}
                    />
                    {new Date(instruction.startTimeStamp).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {/* Stats Grid */}
            <Grid container spacing={1.5} justifyContent="center">
              <Grid item xs={6} sm={3}>
                <StatisticCard
                  title="Questions"
                  count={instruction.totalQuestions}
                  icon={practice}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatisticCard
                  title="Minutes"
                  count={instruction.duration}
                  icon={hours}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatisticCard
                  title="Sections"
                  count={instruction.totalSections}
                  icon={sections}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatisticCard
                  title="Marks"
                  count={instruction.totalMarks}
                  icon={bookmark}
                />
              </Grid>
            </Grid>

            {/* Instructions */}
            <Box width="100%">
              <KnowYourTest instruction={instruction} />
            </Box>

            {/* Timer & Readiness */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              width="100%"
              sx={{
                bgcolor: "var(--sec-color-acc-2)",
                borderRadius: "12px",
                p: 2,
                border: "1px solid var(--sec-color-acc-1)",
              }}
            >
              <Stack gap={0.5}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "var(--text1)",
                  }}
                >
                  🎯 Ready to begin?
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "var(--text3)",
                    fontStyle: "italic",
                  }}
                >
                  Stay focused and give your best!
                </Typography>
              </Stack>

              <Box sx={{ transform: "scale(0.9)" }}>
                <CountDownTimer
                  date={instruction.startTimeStamp}
                  now={now}
                  loading={instruction.startTimeStamp == null}
                  promptTimeOver="Exam started"
                  onComplete={() => {}}
                />
              </Box>
            </Stack>

            <Compatibility />
          </Stack>
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid var(--border-color)",
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "center",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            endIcon={
              isStarting ? (
                <CircularProgress size={20} color="inherit" />
              ) : instruction.settings?.isProTest ? (
                isPro ? (
                  <East />
                ) : (
                  <Lock />
                )
              ) : (
                <East />
              )
            }
            disabled={
              isStarting ||
              (instruction.settings?.isProTest ? (isPro ? false : true) : false)
            }
            onClick={startExam}
            sx={{
              maxWidth: "360px",
              height: "48px",
              borderRadius: "100px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
              boxShadow: "0px 8px 16px var(--primary-color-acc-1)",
              background:
                "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0px 12px 24px var(--primary-color-acc-1)",
                background:
                  "linear-gradient(135deg, var(--primary-color-dark) 0%, #0d3d35 100%)",
              },
              "&:active": {
                transform: "translateY(0px)",
              },
            }}
          >
            {isStarting
              ? "Preparing Exam..."
              : instruction.activeAttempt
              ? "Continue Test"
              : instruction.settings?.isProTest
              ? isPro
                ? "Start Test Now"
                : "Upgrade to PRO to Start"
              : "Start Test Now"}
          </Button>

          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{ opacity: 0.5 }}
          >
            <Typography
              sx={{ fontSize: "11px", fontWeight: 500, color: "var(--text3)" }}
            >
              Powered by
            </Typography>
            <Link href="https://incrix.com" target="_blank">
              <Image
                src="https://incrix.com/_next/static/media/logo-light.885f89fa.svg"
                alt="Incrix Logo"
                width={50}
                height={16}
                style={{ filter: "grayscale(100%)", opacity: 0.7 }}
              />
            </Link>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
