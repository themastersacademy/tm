"use client";
import MasterLogo from "@/src/Components/SideNav/MasterLogo";
import StatisticCard from "@/src/Components/StatisticCard/StatisticCard";
import {
  Bookmark,
  Close,
  East,
  Verified,
  WatchLater,
  HourglassBottomRounded,
  AlarmRounded,
} from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import practice from "@/public/icons/practice.svg";
import hours from "@/public/icons/hours.svg";
import sections from "@/public/icons/sections.svg";
import bookmark from "@/public/icons/bookmark.svg";
import { useEffect, useState } from "react";
import Compatibility from "../Components/Compatibility";
import Countdown from "react-countdown";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import Link from "next/link";
import Image from "next/image";
import CountDownTimer from "../Components/CountDownTimer";
import KnowYourTest from "../Components/KnowYourTest";
import InstructionLoading from "../Components/InstructionLoading";

export default function ExamInstruction() {
  const router = useRouter();
  const [instruction, setInstruction] = useState([]);
  const params = useParams();
  const id = params.id;
  const [clientPerfAtFetch, setClientPerfAtFetch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const now = () => {
    const elapsed = performance.now() - clientPerfAtFetch;
    return instruction.serverTimestamp + elapsed;
  };

  const fetchInstruction = async () => {
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${id}`).then((res) =>
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
    enqueueSnackbar("Starting exam", {
      variant: "loading",
    });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/${id}/start`
      )
        .then((res) => res.json())
        .then((data) => {
          closeSnackbar();
          if (data.success) {
            enqueueSnackbar("Exam started", {
              variant: "success",
            });
            router.push(`/exam/${id}/${data.data.attemptID}`);
          } else {
            enqueueSnackbar(data.message, {
              variant: "error",
            });
          }
        });
    } catch (error) {
      console.error("Error starting exam:", error);
    }
  };

  return (
    <Stack
      sx={{
        backgroundColor: "var(--sec-color-acc-2)",
        minHeight: "100vh",
        gap: "30px",
      }}
    >
      <Stack
        sx={{
          borderBottom: "1px solid var(--border-color)",
          minHeight: "60px",
          backgroundColor: "var(--white)",
          padding: "20px",
        }}
        justifyContent="center"
      >
        <MasterLogo />
      </Stack>
      {isLoading ? (
        <InstructionLoading />
      ) : (
        <Stack
          justifyContent="center"
          alignItems="center"
        sx={{ minHeight: "90vh" }}
      >
        <Stack
          sx={{
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            backgroundColor: "var(--white)",
            width: { xs: "95%", md: "800px" },
            minHeight: "410px",
            padding: { xs: "10px", md: "20px" },
            gap: "30px",
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "18px", fontWeight: "700" }}
            >
              Instruction
            </Typography>
            <Close onClick={() => router.back()} />
          </Stack>
          <Stack alignItems="center" height="20px">
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "800" }}
            >
              {instruction.title}
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            gap={{ xs: "10px", md: "20px" }}
            minHeight="310px"
          >
            <Stack flexDirection="row" gap={{ xs: "5px", sm: "20px" }}>
              <StatisticCard
                title="Total Questions"
                count={instruction.totalQuestions}
                icon={practice}
              />
              <StatisticCard
                title="Time (Minutes)"
                count={instruction.duration}
                icon={hours}
              />
            </Stack>
            <Stack flexDirection="row" gap={{ xs: "5px", sm: "20px" }}>
              <StatisticCard
                title="Total Sections"
                count={instruction.totalSections}
                icon={sections}
              />
              <StatisticCard
                title="Marks"
                count={instruction.totalMarks}
                icon={bookmark}
              />
            </Stack>
            <KnowYourTest instruction={instruction} />
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "16px" },
                fontFamily: "Lato",
                width: { xs: "100%", md: "530px" },
                textAlign: "center",
              }}
            >
              Stay focused, follow the rules, and give your best!
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "13px", md: "16px" },
                fontFamily: "Lato",
                width: { xs: "100%", md: "530px" },
                textAlign: "center",
              }}
            >
              {`Exam scheduled at ${new Date(
                instruction.startTimeStamp
              ).toLocaleString()}`}
            </Typography>
            <Stack height="90px" gap="10px">
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <AlarmRounded
                  sx={{
                    color: "var(--sec-color)",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text1)",
                    fontWeight: "500",
                  }}
                >
                  Are you ready for the exam?
                </Typography>
              </Stack>
              <CountDownTimer
                date={instruction.startTimeStamp}
                now={now}
                loading={instruction.startTimeStamp == null}
                promptTimeOver="Exam started"
                onComplete={() => {}}
              />
            </Stack>
            <Compatibility />
            <Button
              variant="text"
              endIcon={<East />}
              onClick={startExam}
              sx={{
                textTransform: "none",
                color: "var(--primary-color)",
                fontSize: "12px",
                fontFamily: "Lato",
                marginTop: "auto",
              }}
            >
              Start test
            </Button>
          </Stack>
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="15px"
          sx={{
            backgroundColor: "var(--sec-color-acc-2)",
            minHeight: "100px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "var(--text4)",
              fontWeight: "500",
            }}
          >
            Designed and Powered by
          </Typography>
          <Link href="https://incrix.com" target="_blank">
            <Image
              src="https://incrix.com/_next/static/media/logo-light.885f89fa.svg"
              alt="logo"
              width={80}
              height={80}
            />
          </Link>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
