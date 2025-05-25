"use client";
import { East } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import mocks from "@/public/icons/mocks.svg";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { useRouter } from "next/navigation";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import { useEffect, useState } from "react";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import banking from "@/public/icons/banking.svg";
import Image from "next/image";

export default function Exams({
  scheduledExams,
  isLoading,
  setIsLoading,
  examID,
}) {
  const router = useRouter();
  const [examHistory, setExamHistory] = useState([]);
  const examList = scheduledExams.map((exam) => ({
    title: exam.title,
    icon: mocks.src,
    subtitle: new Date(exam.startTimeStamp).toLocaleString(),
    actionButton: (
      <Button
        variant="text"
        endIcon={<East sx={{ width: "16px", height: "16px" }} />}
        sx={{
          textTransform: "none",
          fontFamily: "Lato",
          color: "var(--primary-color)",
          fontSize: "12px",
        }}
        onClick={() => {
          router.push(`/exam/${exam.id}`);
        }}
      >
        Start
      </Button>
    ),
  }));

  const fetchHistory = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${examID}/get-scheduled-history`
    );
    const data = await response.json();
    if (data.success) {
      setExamHistory(data.data);
      console.log(data.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Stack gap="20px">
      <Stack gap="15px" overflowy="auto">
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
        >
          Exams
        </Typography>
        {!isLoading ? (
          examList.length > 0 ? (
            examList.map((item, index) => <PrimaryCard key={index} {...item} />)
          ) : (
            <NoDataFound info="No scheduled exams available" />
          )
        ) : (
          <PrimaryCardSkeleton />
        )}
      </Stack>
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
      >
        Attempted
      </Typography>
      <Stack gap="10px" flexDirection="row" flexWrap="wrap">
        {!isLoading ? (
          examHistory.length > 0 ? (
            examHistory.map((exam, index) => (
              <SecondaryCard
                key={index}
                title={exam.title}
                icon={<Image src={banking} alt="" width={22} />}
                subTitle={
                  <Stack flexDirection="row" gap="10px">
                    <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                      {exam.obtainedMarks} / {exam.totalMarks} Marks
                    </Typography>
                    <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                      {exam.totalQuestions} Questions
                    </Typography>
                    <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                      {exam.duration} minutes
                    </Typography>
                  </Stack>
                }
                button={
                  exam.status === "COMPLETED" ? (
                    <Button
                      variant="text"
                      onClick={() =>
                        router.push(`/exam/${exam.examID}/${exam.id}/result`)
                      }
                      sx={{
                        textTransform: "none",
                        color: "var(--sec-color)",
                        fontSize: "12px",
                        padding: { xs: "0px", md: "4px" },
                      }}
                    >
                      View Result
                    </Button>
                  ) : (
                    <Button
                      variant="text"
                      onClick={() =>
                        router.push(`/exam/${exam.examID}/${exam.id}`)
                      }
                      sx={{
                        textTransform: "none",
                        color: "var(--primary-color)",
                        fontSize: "12px",
                        padding: { xs: "0px", md: "4px" },
                      }}
                    >
                      Continue Test
                    </Button>
                  )
                }
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
