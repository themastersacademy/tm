"use client";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import mocks from "@/public/icons/mocks.svg";
import Header from "@/src/Components/Header/Header";
import { useRouter} from "next/navigation";
import Image from "next/image";
import { ArrowBackIos } from "@mui/icons-material";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import { useExams } from "@/src/app/context/ExamProvider";

export default function History() {
  const { history, loading} = useExams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Stack sx={{ display: { xs: "block", md: "none" } }}>
        <MobileHeader />
      </Stack>
      {loading ? (
        <PageSkeleton />
      ) : (
        <Stack width="100%" maxWidth="1200px" margin="0 auto">
          <Stack
            padding={{ xs: "10px", md: "20px" }}
            sx={{ marginBottom: { xs: "80px", md: "0px" } }}
            gap="20px"
            justifyContent="center"
          >
            <Stack
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Header />
            </Stack>
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Stack
                flexDirection="row"
                gap="4px"
                alignItems="center"
                width="100%"
              >
                <ArrowBackIos
                  onClick={() => router.back()}
                  fontSize="small"
                  sx={{
                    cursor: "pointer",
                    display: { xs: "flex", md: "none" },
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Exam History
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              <Stack
                flexDirection="row"
                flexWrap="wrap"
                gap="10px"
                minWidth="100%"
              >
                {!loading ? (
                  history.length > 0 ? (
                    history.map((item, index) => (
                      <SecondaryCard
                        key={index}
                        title={`${item.title} (${item.type} exam)`}
                        icon={
                          <Image src={mocks} alt="" width={24} height={24} />
                        }
                        button={
                          item.status === "COMPLETED" ? (
                            <Button
                              variant="text"
                              onClick={() =>
                                router.push(
                                  `/exam/${item.examID}/${item.id}/result`
                                )
                              }
                              sx={{
                                textTransform: "none",
                                color: "var(--sec-color)",
                                fontSize: "12px",
                                padding: "0px",
                              }}
                            >
                              View Result
                            </Button>
                          ) : (
                            <Button
                              variant="text"
                              onClick={() =>
                                router.push(`/exam/${item.examID}/${item.id}`)
                              }
                              sx={{
                                textTransform: "none",
                                color: "var(--primary-color)",
                                fontSize: "12px",
                                padding: "0px",
                              }}
                            >
                              Continue Test
                            </Button>
                          )
                        }
                        subTitle={
                          <Stack flexDirection="row" gap="7px">
                            <Typography
                              sx={{ fontFamily: "Lato", fontSize: "12px" }}
                            >
                              {item.obtainedMarks} / {item.totalMarks}{" "}
                              {isMobile ? "Marks" : "Marks"}
                            </Typography>
                            <Typography
                              sx={{ fontFamily: "Lato", fontSize: "12px" }}
                            >
                              {item.totalQuestions}{" "}
                              {isMobile ? "Q" : "Questions"}
                            </Typography>
                            <Typography
                              sx={{ fontFamily: "Lato", fontSize: "12px" }}
                            >
                              {item.duration} {isMobile ? "mins" : "minutes"}
                            </Typography>
                          </Stack>
                        }
                        cardWidth={{ xs: "100%", md: "450px" }}
                      />
                    ))
                  ) : (
                    <Stack
                      width="100%"
                      height="500px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <NoDataFound info="You have not taken any exams yet." />
                    </Stack>
                  )
                ) : (
                  <SecondaryCardSkeleton />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
}
