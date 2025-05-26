"use client";
import { useEffect, useState, useCallback } from "react";
import Header from "@/src/Components/Header/Header";
import {
  Stack,
  Typography,
  Button,
  IconButton,
  DialogContent,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import mocks from "@/public/icons/mocks.svg";
import { East } from "@mui/icons-material";
import troffy from "@/public/icons/week2.svg";
import DialogBox from "@/src/Components/DialogBox/DialogBox";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import { useRouter, useParams } from "next/navigation";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import ResponsiveTestSeries from "./Components/ResponsiveTestSeries";
import LinearProgressLoading from "@/src/Components/LinearProgressLoading/LinearProgressLoading";
import { useSnackbar } from "notistack";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import ExamGroups from "./Components/ExamGroups";
import { useExams } from "@/src/app/context/ExamProvider";

export default function Exams() {
  const { group, mock, loading, subjects, error } = useExams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const params = useParams();
  const goalID = params.goalID;
  const { enqueueSnackbar } = useSnackbar();
  const [loacalLoading, setLoacalLoading] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);

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
            spacing={2}
            padding="20px"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Header />
            <Stack gap="20px">
              <Stack
                spacing={2}
                sx={{ display: { xs: "none", md: "block" }, gap: "30px" }}
              >
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  Practice Test
                </Typography>
                <ExamGroups handleOpen={handleOpen} />
              </Stack>
              <Typography
                sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
              >
                Test Series
              </Typography>

              <Stack gap="20px" flexDirection="row" flexWrap="wrap">
                {!loading ? (
                  mock && mock.length > 0 ? (
                    mock.map((test) => (
                      <PrimaryCard
                        key={test.id}
                        title={test.title}
                        icon={mocks.src}
                        actionButton={
                          <Button
                            variant="text"
                            endIcon={<East />}
                            onClick={() => {
                              setLoacalLoading(true);
                              router.push(`/exam/${test.id}`);
                            }}
                            sx={{
                              color: "var(--primary-color)",
                              textTransform: "none",
                              fontSize: "12px",
                            }}
                          >
                            Take Test
                          </Button>
                        }
                      />
                    ))
                  ) : (
                    <Typography>No test series found</Typography>
                  )
                ) : (
                  <PrimaryCardSkeleton />
                )}
              </Stack>
            </Stack>

            <Stack gap="20px">
              <Typography
                sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
              >
                Exam groups
              </Typography>
              <Stack flexDirection="row" flexWrap="wrap" gap="20px">
                {!loading ? (
                  group && group.length > 0 ? (
                    group.map((group, index) => (
                      <PrimaryCard
                        key={index}
                        title={group.title}
                        icon={troffy.src}
                        actionButton={
                          <Button
                            variant="text"
                            onClick={() => {
                              setLoacalLoading(true);
                              router.push(
                                `/dashboard/${goalID}/exam/${group.id}`
                              );
                            }}
                            endIcon={<East />}
                            sx={{
                              textTransform: "none",
                              color: "var(--primary-color)",
                              fontFamily: "Lato",
                              fontSize: "12px",
                            }}
                          >
                            View Exams
                          </Button>
                        }
                      />
                    ))
                  ) : (
                    "No Group Exams found"
                  )
                ) : (
                  <PrimaryCardSkeleton />
                )}
              </Stack>
            </Stack>
          </Stack>
          <ResponsiveTestSeries
            testSeries={mock}
            groupExams={group}
            subjectOptions={subjectOptions}
          />
        </Stack>
      )}

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
              onClick={handleStartTest}
              endIcon={<East />}
              sx={{
                textTransform: "none",
                color: "var(--primary-color)",
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              Start Test
            </Button>
          }
        >
          <DialogContent>
            <Stack gap="15px">
              <StyledSelect
                title="Select topic"
                options={subjectOptions}
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                }}
                getLabel={(option) => option.label}
                getValue={(option) => option.value}
              />

              <StyledSelect
                title="Difficulty level"
                options={difficultyLevelOptions}
                value={difficultyLevel}
                onChange={(e) => {
                  setDifficultyLevel(e.target.value);
                }}
                getLabel={(option) => option.label}
                getValue={(option) => option.value}
                sx={{ width: "100%" }}
              />
            </Stack>
          </DialogContent>
        </DialogBox>
      )}
    </Stack>
  );
}
