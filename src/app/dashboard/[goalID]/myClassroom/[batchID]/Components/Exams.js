"use client";
import { East } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import mocks from "@/public/icons/mocks.svg";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { useRouter } from "next/navigation";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import { useEffect, useState, useCallback, useMemo } from "react";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import banking from "@/public/icons/banking.svg";
import Image from "next/image";

export default function Exams({ scheduledExams, examID }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [examHistory, setExamHistory] = useState([]);

  // Fetch history, memoized
  const fetchHistory = useCallback(async () => {
    if (!examID) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${examID}/get-scheduled-history`
      );
      const data = await res.json();
      if (data.success) {
        setExamHistory(data.data || []);
        setIsLoading(false);
      } else {
        setExamHistory([]);
      }
    } catch (err) {
      setExamHistory([]);
      setIsLoading(false);
    }
  }, [examID, setIsLoading]);

  // Run on mount or when examID changes
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Memoize scheduled exam list items
  const examList = useMemo(() => {
    return Array.isArray(scheduledExams)
      ? scheduledExams.map((exam) => {
          const { id, title, startTimeStamp } = exam;
          const subtitle = new Date(startTimeStamp).toLocaleString();
          const handleStart = () => {
            router.push(`/exam/${id}`);
          };
          return {
            key: id,
            title,
            icon: mocks.src,
            subtitle,
            actionButton: (
              <Button
                variant="text"
                endIcon={<East sx={{ width: 16, height: 16 }} />}
                sx={{
                  textTransform: "none",
                  fontFamily: "Lato",
                  color: "var(--primary-color)",
                  fontSize: "12px",
                }}
                onClick={handleStart}
              >
                Start
              </Button>
            ),
          };
        })
      : [];
  }, [scheduledExams, router]);

  // Memoize history cards
  const historyList = useMemo(() => {
    return Array.isArray(examHistory) && examHistory.length > 0
      ? examHistory.map((exam) => {
          const {
            id: attemptId,
            examID: exID,
            title,
            obtainedMarks,
            totalMarks,
            totalQuestions,
            duration,
            status,
          } = exam;
          const handleClick = () => {
            if (status === "COMPLETED") {
              router.push(`/exam/${exID}/${attemptId}/result`);
            } else {
              router.push(`/exam/${exID}/${attemptId}`);
            }
          };
          return {
            key: attemptId,
            title,
            icon: <Image src={banking} alt="" width={22} height={22} />,
            subTitle: (
              <Stack direction="row" gap="10px">
                <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                  {obtainedMarks} / {totalMarks} Marks
                </Typography>
                <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                  {totalQuestions} Questions
                </Typography>
                <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                  {duration} minutes
                </Typography>
              </Stack>
            ),
            actionButton: (
              <Button
                variant="text"
                onClick={handleClick}
                sx={{
                  textTransform: "none",
                  color:
                    status === "COMPLETED"
                      ? "var(--sec-color)"
                      : "var(--primary-color)",
                  fontSize: "12px",
                  padding: { xs: "0px", md: "4px" },
                }}
              >
                {status === "COMPLETED" ? "View Result" : "Continue Test"}
              </Button>
            ),
          };
        })
      : [];
  }, [examHistory, router]);

  return (
    <Stack gap="20px">
      {/* Scheduled Exams */}
      <Stack gap="15px" sx={{ overflowY: "auto" }}>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: 700 }}
        >
          Exams
        </Typography>
        {!isLoading ? (
          examList.length > 0 ? (
            examList.map((item) => (
              <PrimaryCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                subtitle={item.subtitle}
                actionButton={item.actionButton}
              />
            ))
          ) : (
            <NoDataFound info="No scheduled exams available" />
          )
        ) : (
          <PrimaryCardSkeleton />
        )}
      </Stack>

      {/* Attempted Exams */}
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: 700 }}
      >
        Attempted
      </Typography>
      <Stack gap="10px" direction="row" flexWrap="wrap">
        {!isLoading ? (
          historyList.length > 0 ? (
            historyList.map((item) => (
              <SecondaryCard
                key={item.key}
                title={item.title}
                icon={item.icon}
                subTitle={item.subTitle}
                button={item.actionButton}
                cardWidth="500px"
              />
            ))
          ) : (
            <NoDataFound info="No exams attempted" />
          )
        ) : (
          <SecondaryCardSkeleton />
        )}
      </Stack>
    </Stack>
  );
}
