"use client";
import { useEffect, useState } from "react";
import Header from "@/src/Components/Header/Header";
import {
  Stack,
  Typography,
  Button,
  IconButton,
  DialogContent,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { Close, Lock, East } from "@mui/icons-material";
import mocks from "@/public/icons/mocks.svg";
import troffy from "@/public/icons/week2.svg";
import DialogBox from "@/src/Components/DialogBox/DialogBox";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import { useRouter, useParams } from "next/navigation";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import ResponsiveTestSeries from "./Components/ResponsiveTestSeries";
import ExamCard from "@/src/Components/ExamCard/ExamCard";
import LinearProgressLoading from "@/src/Components/LinearProgressLoading/LinearProgressLoading";
import { enqueueSnackbar } from "notistack";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import ExamGroups from "./Components/ExamGroups";
import { useExams } from "@/src/app/context/ExamProvider";
import { useSession } from "next-auth/react";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";

export default function Exams() {
  const { data: session } = useSession();
  const isPro = session?.user?.accountType === "PRO";
  const { group, mock, loading, subjects, history } = useExams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const params = useParams();
  const goalID = params.goalID;
  const [loacalLoading, setLoacalLoading] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  // Tab State
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };
  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };

  useEffect(() => {
    if (subjects) {
      const subjectsOptions = subjects.map((subject) => ({
        label: subject.title,
        value: subject.subjectID,
      }));
      setSubjectOptions(subjectsOptions);
    }
  }, [subjects]);

  const difficultyLevelOptions = [
    { label: "All", value: "all" },
    { label: "Easy", value: 0 },
    { label: "Medium", value: 1 },
    { label: "Hard", value: 2 },
  ];

  const handleStartTest = async () => {
    if (!selectedSubject) {
      enqueueSnackbar("Please select a subject", {
        variant: "error",
      });
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/type/${goalID}/practice/create`,
      {
        method: "POST",
        body: JSON.stringify({
          subjectID: selectedSubject,
          ...(difficultyLevel !== "all" && { difficultyLevel }),
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      router.push(`/exam/${data.data.examID}/${data.data.attemptID}`);
    } else {
      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  return (
    <Stack width="100%" alignItems="center">
      {loacalLoading && <LinearProgressLoading />}
      {loading ? (
        <PageSkeleton />
      ) : (
        <Stack width="100%" maxWidth="1200px">
          <Stack
            spacing={3}
            padding={{ xs: 2, md: 4 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Header />

            {/* Tabs Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ borderBottom: "1px solid var(--border-color)", mb: 4 }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    fontFamily: "var(--font-geist-sans)",
                    minWidth: "120px",
                    color: "var(--text2)",
                  },
                  "& .Mui-selected": {
                    color: "var(--primary-color) !important",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "var(--primary-color)",
                    height: "3px",
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
                <Tab label="Available Exams" />
                <Tab label="Exam History" />
              </Tabs>
            </Stack>

            {/* Tab 1: Available Exams */}
            <Box role="tabpanel" hidden={tabValue !== 0}>
              {tabValue === 0 && (
                <Stack gap={5}>
                  <Stack
                    spacing={3}
                    sx={{ display: { xs: "none", md: "block" } }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      Practice Test
                    </Typography>
                    <ExamGroups handleOpen={handleOpen} />
                  </Stack>

                  {/* Test Series Section */}
                  <Stack gap={3}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      Test Series
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(auto-fill, minmax(300px, 1fr))",
                        },
                        gap: 3,
                      }}
                    >
                      {!loading ? (
                        mock && mock.length > 0 ? (
                          mock.map((test) => (
                            <ExamCard
                              key={test.id}
                              title={test.title}
                              icon={mocks.src}
                              duration={test.duration || 60}
                              totalQuestions={test.totalQuestions || 50}
                              totalMarks={test.totalMarks || 100}
                              difficulty={test.difficulty || "medium"}
                              status={test.status || "upcoming"}
                              actionButton={
                                <Button
                                  variant="outlined"
                                  endIcon={<East />}
                                  onClick={() => {
                                    setLoacalLoading(true);
                                    router.push(`/exam/${test.id}`);
                                  }}
                                  fullWidth
                                  sx={{
                                    color: "var(--primary-color)",
                                    borderColor: "var(--primary-color)",
                                    textTransform: "none",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    fontFamily: "var(--font-geist-sans)",
                                    py: 1,
                                    "&:hover": {
                                      backgroundColor: "var(--sec-color-acc-2)",
                                      borderColor: "var(--primary-color)",
                                    },
                                  }}
                                >
                                  Take Test
                                </Button>
                              }
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            No test series found
                          </Typography>
                        )
                      ) : (
                        <PrimaryCardSkeleton />
                      )}
                    </Box>
                  </Stack>

                  {/* Exam Groups Section */}
                  <Stack gap={3}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: "var(--font-geist-sans)",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      Exam Groups
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(auto-fill, minmax(300px, 1fr))",
                        },
                        gap: 3,
                      }}
                    >
                      {!loading ? (
                        group && group.length > 0 ? (
                          group.map((group, index) => (
                            <ExamCard
                              key={index}
                              title={group.title}
                              icon={troffy.src}
                              duration={null}
                              totalQuestions={group.totalExams || 0}
                              totalMarks={null}
                              difficulty="various"
                              status="active"
                              actionButton={
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setLoacalLoading(true);
                                    router.push(
                                      `/dashboard/${goalID}/exam/${group.id}`
                                    );
                                  }}
                                  endIcon={<East />}
                                  fullWidth
                                  sx={{
                                    textTransform: "none",
                                    color: "var(--primary-color)",
                                    borderColor: "var(--primary-color)",
                                    fontFamily: "var(--font-geist-sans)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    py: 1,
                                    "&:hover": {
                                      backgroundColor: "var(--sec-color-acc-2)",
                                      borderColor: "var(--primary-color)",
                                    },
                                  }}
                                >
                                  View Exams
                                </Button>
                              }
                            />
                          ))
                        ) : (
                          <Typography color="text.secondary">
                            No Group Exams found
                          </Typography>
                        )
                      ) : (
                        <PrimaryCardSkeleton />
                      )}
                    </Box>
                  </Stack>
                </Stack>
              )}
            </Box>

            {/* Tab 2: Exam History */}
            <Box role="tabpanel" hidden={tabValue !== 1}>
              {tabValue === 1 && (
                <Stack gap={3}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "var(--font-geist-sans)",
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    Your Attempts
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(auto-fill, minmax(300px, 1fr))",
                      },
                      gap: 3,
                    }}
                  >
                    {!loading ? (
                      history && history.length > 0 ? (
                        history.map((item, index) => (
                          <ExamCard
                            key={index}
                            title={`${item.title} (${item.type})`}
                            icon={mocks.src}
                            duration={item.duration}
                            totalQuestions={item.totalQuestions}
                            totalMarks={item.totalMarks}
                            difficulty="medium"
                            status={
                              item.status === "COMPLETED" ? "completed" : "live"
                            }
                            score={
                              item.status === "COMPLETED"
                                ? item.obtainedMarks
                                : null
                            }
                            actionButton={
                              item.status === "COMPLETED" ? (
                                <Button
                                  variant="outlined"
                                  onClick={() =>
                                    router.push(
                                      `/exam/${item.examID}/${item.id}/result`
                                    )
                                  }
                                  fullWidth
                                  sx={{
                                    textTransform: "none",
                                    color: "var(--sec-color)",
                                    borderColor: "var(--sec-color)",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    fontFamily: "var(--font-geist-sans)",
                                    py: 1,
                                  }}
                                >
                                  View Result
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    router.push(
                                      `/exam/${item.examID}/${item.id}`
                                    )
                                  }
                                  fullWidth
                                  sx={{
                                    textTransform: "none",
                                    backgroundColor: "var(--primary-color)",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    fontFamily: "var(--font-geist-sans)",
                                    py: 1,
                                  }}
                                >
                                  Continue Test
                                </Button>
                              )
                            }
                          />
                        ))
                      ) : (
                        <Stack
                          width="100%"
                          height="400px"
                          justifyContent="center"
                          alignItems="center"
                          gridColumn="1 / -1"
                        >
                          <NoDataFound info="You have not taken any exams yet." />
                        </Stack>
                      )
                    ) : (
                      <PrimaryCardSkeleton />
                    )}
                  </Box>
                </Stack>
              )}
            </Box>
          </Stack>

          {/* Mobile View */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ResponsiveTestSeries
              testSeries={mock}
              groupExams={group}
              subjectOptions={subjectOptions}
            />
          </Box>
        </Stack>
      )}
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />

      {subjectOptions.length > 0 && (
        <DialogBox
          isOpen={open}
          title="Take a Practice Test"
          onClose={handleClose}
          icon={
            <IconButton
              onClick={handleClose}
              sx={{ borderRadius: "8px", padding: "4px" }}
            >
              <Close />
            </IconButton>
          }
          actionButton={
            <Button
              variant="text"
              onClick={isPro ? handleStartTest : handlePlansDialogOpen}
              endIcon={isPro ? <East /> : <Lock />}
              sx={{
                textTransform: "none",
                color: "var(--primary-color)",
                fontFamily: "var(--font-geist-sans)",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {isPro ? "Start Test" : "Upgrade to PRO"}
            </Button>
          }
        >
          <DialogContent>
            <Stack gap={3}>
              <StyledSelect
                title="Select Topic"
                options={subjectOptions}
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                }}
                getLabel={(option) => option.label}
                getValue={(option) => option.value}
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "var(--font-geist-sans)",
                  },
                  "& .MuiSelect-select": {
                    fontFamily: "var(--font-geist-sans)",
                  },
                }}
              />

              <Stack gap={1.5}>
                <Typography
                  sx={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  Difficulty Level
                </Typography>
                <Stack direction="row" gap={1.5}>
                  {difficultyLevelOptions.map((option) => {
                    const isSelected = difficultyLevel === option.value;
                    let color = "var(--text2)";
                    let borderColor = "var(--border-color)";
                    let bgcolor = "transparent";

                    if (isSelected) {
                      if (option.value === "all") {
                        color = "var(--primary-color)";
                        borderColor = "var(--primary-color)";
                        bgcolor = "var(--primary-color-acc-2)";
                      } else if (option.value === 0) {
                        color = "#4CAF50";
                        borderColor = "#4CAF50";
                        bgcolor = "#E8F5E9";
                      } else if (option.value === 1) {
                        color = "#FF9800";
                        borderColor = "#FF9800";
                        bgcolor = "#FFF3E0";
                      } else if (option.value === 2) {
                        color = "#F44336";
                        borderColor = "#F44336";
                        bgcolor = "#FFEBEE";
                      }
                    }

                    return (
                      <Box
                        key={option.value}
                        onClick={() => setDifficultyLevel(option.value)}
                        sx={{
                          flex: 1,
                          border: `1px solid ${borderColor}`,
                          borderRadius: "12px",
                          padding: "12px",
                          cursor: "pointer",
                          bgcolor: bgcolor,
                          transition: "all 0.2s ease",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          "&:hover": {
                            borderColor: isSelected
                              ? borderColor
                              : "var(--text2)",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "var(--font-geist-sans)",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: color,
                          }}
                        >
                          {option.label}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
        </DialogBox>
      )}
    </Stack>
  );
}
