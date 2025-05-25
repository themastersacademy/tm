"use client";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { Chip, Stack, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import Overview from "@/src/app/exam/Components/Overview";
import mock from "@/public/icons/mocks.svg";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import ResultSection from "@/src/Components/ResultSection/ResultSection";
import Loading from "./loading";

export default function Result() {
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;
  const [result, setResult] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswerList, setUserAnswerList] = useState([]);
  let questionIndex = 0;

  const fetchResult = async () => {
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
        console.log("Error fetching result");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchResult();
  }, []);

  return (
    <Stack
      padding={{ xs: "9px", md: "30px" }}
      sx={{ backgroundColor: "var(--sec-color-acc-2)" }}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <Stack
          sx={{
            backgroundColor: "var(--white)",
            minHeight: "100vh",
            border: "1px solid var(--border-color)",
            borderRadius: "10px",
            padding: { xs: "8px", md: "20px" },
            gap: "20px",
            width: "100%",
          }}
        >
          <Stack flexDirection="row" gap="6px" alignItems="center">
            <ArrowBackIosNewRounded
              fontSize="small"
              onClick={() => router.push(`/dashboard/${goalID}/exam`)}
              sx={{ cursor: "pointer" }}
            />
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
            >
              Result
            </Typography>
          </Stack>
          <Stack>
            <SecondaryCard
              title={result?.title || "Mock"}
              subTitle={
                <Stack flexDirection="row" gap="30px">
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "var(--text3)",
                    }}
                  >
                    {`${new Date(
                      result?.startTimeStamp
                    ).toLocaleDateString()} - ${new Date(
                      result?.endedAt
                    ).toLocaleDateString()}` || "0"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "var(--text3)",
                    }}
                  >
                    {result?.totalQuestions || "0"} Questions
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "var(--text3)",
                    }}
                  >
                    {result?.duration || "0"} Minutes
                  </Typography>
                </Stack>
              }
              icon={<Image src={mock} alt="mocks" width={25} height={25} />}
              button={
                result?.status === "COMPLETED" && (
                  <Chip
                    size="small"
                    label="Completed"
                    sx={{
                      backgroundColor: "var(--primary-color-acc-2)",
                      color: "var(--primary-color)",
                      fontFamily: "Lato",
                      fontSize: "12px",
                      borderRadius: "5px",
                    }}
                  />
                )
              }
            />
          </Stack>
          <Overview result={result} />
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
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
