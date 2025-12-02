"use client";
import {
  Button,
  Skeleton,
  Stack,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  InsertDriveFile,
  ShoppingBagRounded,
  Timeline,
  AccessTime,
  EmojiEvents,
  TrendingUp,
  PlayArrow,
} from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Components
import GoalHead from "@/src/Components/GoalHead/GoalHead";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import PracticeTest from "../Components/PracticeTest";
import GoalContents from "../Components/GoalContents";
import MobileSidebar from "../Components/MobileSidebar";
import LinearProgressLoading from "@/src/Components/LinearProgressLoading/LinearProgressLoading";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";

// API helpers
const fetchGoalDetails = async (goalID, signal) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/goal-details`, {
    method: "POST",
    body: JSON.stringify({ goalID }),
    signal,
  }).then((res) => res.json());

const fetchBlog = async (goalID, blogID, signal) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/get-blog`, {
    method: "POST",
    body: JSON.stringify({ goalID, blogID }),
    signal,
  }).then((res) => res.json());

const fetchStats = async (goalID, signal) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home/stats`, {
    method: "POST",
    body: JSON.stringify({ goalID }),
    signal,
  }).then((res) => res.json());

export default function HomeGoalID() {
  const { homeGoalID: goalID } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [goalDetails, setGoalDetails] = useState({});
  const [blogList, setBlogList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [stats, setStats] = useState(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [isBlogLoading, setIsBlogLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  const pageLoading = isGoalLoading || isBlogLoading;

  const getBlogData = useCallback(
    async (blogID) => {
      const controller = new AbortController();
      setIsBlogLoading(true);
      try {
        const data = await fetchBlog(goalID, blogID, controller.signal);
        if (data.success) {
          const normalizedBlog = {
            ...data.data,
            blogID: data.data.id,
          };
          setSelectedBlog(normalizedBlog);
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error("Blog fetch error:", err);
      } finally {
        setIsBlogLoading(false);
      }
    },
    [goalID]
  );

  const getStatsData = useCallback(async () => {
    const controller = new AbortController();
    setIsStatsLoading(true);
    try {
      const data = await fetchStats(goalID, controller.signal);
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Stats fetch error:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [goalID]);

  const getGoalData = useCallback(async () => {
    const controller = new AbortController();
    setIsGoalLoading(true);
    try {
      const data = await fetchGoalDetails(goalID, controller.signal);
      if (data.success) {
        setGoalDetails(data.data);
        const blogs = data.data.blogList || [];
        setBlogList(blogs);
        if (blogs.length > 0) getBlogData(blogs[0].blogID);
      } else {
        console.error("Goal fetch failed:", data.message);
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error("Goal fetch error:", err);
    } finally {
      setIsGoalLoading(false);
    }
  }, [goalID, getBlogData]);

  useEffect(() => {
    getGoalData();
    getStatsData();
  }, [getGoalData, getStatsData]);

  const handlePurchase = (courseID) => {
    router.push(`/dashboard/${goalID}/courses/${courseID}`);
  };

  return (
    <Stack
      padding={{ xs: "16px", md: "32px" }}
      gap="32px"
      sx={{ minHeight: "100vh", mb: { xs: "70px", md: 0 } }}
      width="100%"
      alignItems="center"
    >
      {pageLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <Stack width="100%" maxWidth="1200px" gap="32px">
            <GoalHead
              title={
                isGoalLoading ? <Skeleton width="120px" /> : goalDetails.title
              }
              icon={goalDetails.icon}
              isPro={session?.user?.accountType !== "PRO"}
              bannerImage={goalDetails.bannerImage}
            />

            {/* Quick Stats Section */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 2,
              }}
            >
              {[
                {
                  label: "Progress",
                  value: isStatsLoading ? (
                    <Skeleton width="40px" />
                  ) : (
                    `${stats?.progress || 0}%`
                  ),
                  icon: <Timeline />,
                  color: "#3b82f6",
                },
                {
                  label: "Time Spent",
                  value: isStatsLoading ? (
                    <Skeleton width="60px" />
                  ) : (
                    stats?.timeSpent || "0h 0m"
                  ),
                  icon: <AccessTime />,
                  color: "#10b981",
                },
                {
                  label: "Quizzes",
                  value: isStatsLoading ? (
                    <Skeleton width="30px" />
                  ) : (
                    stats?.quizzesTaken || 0
                  ),
                  icon: <EmojiEvents />,
                  color: "#f59e0b",
                },
                {
                  label: "Streak",
                  value: isStatsLoading ? (
                    <Skeleton width="50px" />
                  ) : (
                    stats?.streak || "0 Days"
                  ),
                  icon: <TrendingUp />,
                  color: "#ef4444",
                },
              ].map((stat, idx) => (
                <Stack
                  key={idx}
                  direction="row"
                  alignItems="center"
                  gap={2}
                  sx={{
                    bgcolor: "white",
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "12px",
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      display: "flex",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Stack>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 800,
                        color: "#1e293b",
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Box>

            <Stack
              direction={{ xs: "column", lg: "row" }}
              gap="32px"
              width="100%"
              alignItems="flex-start"
            >
              {/* LEFT COLUMN */}
              <Stack flex={1} gap="32px">
                {/* Overview */}
                <Stack gap="16px">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack gap="4px">
                      <Typography
                        sx={{
                          fontSize: { xs: "20px", md: "24px" },
                          fontWeight: 800,
                          color: "#1e293b",
                          letterSpacing: "-0.5px",
                        }}
                      >
                        Overview
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        About this learning path
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    sx={{
                      border: "1px solid #e2e8f0",
                      bgcolor: "white",
                      borderRadius: "24px",
                      p: { xs: "24px", md: "32px" },
                      minHeight: { xs: "auto", md: "300px" },
                      gap: "16px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {isBlogLoading ? (
                      <LinearProgressLoading />
                    ) : selectedBlog ? (
                      <MDPreview value={selectedBlog.description} />
                    ) : (
                      <NoDataFound info="No Blog Content Available" />
                    )}
                  </Stack>
                </Stack>

                {/* Subjects */}
                <Stack gap="16px">
                  <Stack gap="4px">
                    <Typography
                      sx={{
                        fontSize: { xs: "20px", md: "24px" },
                        fontWeight: 800,
                        color: "#1e293b",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Subjects
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      Core topics you&apos;ll master
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(auto-fill, minmax(280px, 1fr))",
                      },
                      gap: "20px",
                      width: "100%",
                    }}
                  >
                    {isGoalLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <SecondaryCardSkeleton cardWidth="100%" key={i} />
                      ))
                    ) : goalDetails.subjectList?.length ? (
                      goalDetails.subjectList.map((subject, i) => (
                        <SecondaryCard
                          key={i}
                          title={subject.title}
                          cardWidth="100%"
                          icon={
                            <InsertDriveFile
                              sx={{ color: "var(--sec-color)" }}
                            />
                          }
                        />
                      ))
                    ) : (
                      <NoDataFound info="No Subjects Found" />
                    )}
                  </Stack>
                </Stack>

                {/* Courses */}
                <Stack gap="16px">
                  <Stack gap="4px">
                    <Typography
                      sx={{
                        fontSize: { xs: "20px", md: "24px" },
                        fontWeight: 800,
                        color: "#1e293b",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Recommended Courses
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      Structured learning paths for you
                    </Typography>
                  </Stack>

                  {isGoalLoading ? (
                    <Stack
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(auto-fill, minmax(280px, 1fr))",
                        },
                        gap: "20px",
                      }}
                    >
                      <CourseCardSkeleton />
                      <CourseCardSkeleton />
                      <CourseCardSkeleton />
                    </Stack>
                  ) : goalDetails.coursesList?.length ? (
                    <Stack
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(auto-fill, minmax(280px, 1fr))",
                        },
                        gap: "20px",
                        width: "100%",
                      }}
                    >
                      {goalDetails.coursesList.map((course) => (
                        <CourseCard
                          key={course.id}
                          title={course.title}
                          thumbnail={course.thumbnail}
                          Language={course.language}
                          lessons={`${course.lessons} Lessons`}
                          hours={`${course.duration} min`}
                          progress={course.progress}
                          actionButton={
                            <Button
                              variant="text"
                              endIcon={
                                <ShoppingBagRounded
                                  sx={{ width: 16, height: 16 }}
                                />
                              }
                              size="small"
                              onClick={() => handlePurchase(course.id)}
                              sx={{
                                textTransform: "none",
                                color: "white",
                                bgcolor: "var(--primary-color)",
                                fontFamily: "Lato",
                                fontSize: "12px",
                                fontWeight: 700,
                                px: 2,
                                borderRadius: "8px",
                              }}
                            >
                              Enroll
                            </Button>
                          }
                          actionMobile={
                            <Button
                              variant="contained"
                              endIcon={
                                <ShoppingBagRounded
                                  sx={{ width: 16, height: 16 }}
                                />
                              }
                              sx={{
                                textTransform: "none",
                                color: "white",
                                bgcolor: "var(--primary-color)",
                                borderRadius: "0px 0px 10px 10px",
                                fontWeight: 700,
                              }}
                              onClick={() => handlePurchase(course.id)}
                            >
                              Enroll Now
                            </Button>
                          }
                        />
                      ))}
                    </Stack>
                  ) : (
                    <NoDataFound info="No Courses Available" />
                  )}
                </Stack>

                {/* Quizzes */}
                <Stack gap="16px">
                  <Stack gap="4px">
                    <Typography
                      sx={{
                        fontSize: { xs: "20px", md: "24px" },
                        fontWeight: 800,
                        color: "#1e293b",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      Weekly Quizzes
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#64748b",
                        fontWeight: 500,
                      }}
                    >
                      Test your knowledge regularly
                    </Typography>
                  </Stack>
                  <PracticeTest />
                </Stack>
              </Stack>

              {/* RIGHT COLUMN (Desktop) - Sticky Sidebar */}
              <Stack
                display={{ xs: "none", lg: "flex" }}
                gap={3}
                sx={{
                  minWidth: "300px",
                  maxWidth: "340px",
                  position: "sticky",
                  top: "32px",
                  alignSelf: "flex-start",
                  height: "fit-content",
                }}
              >
                {/* Quick Actions Card */}
                <Stack
                  sx={{
                    bgcolor: "white",
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                  gap={2}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#1e293b",
                      mb: 1,
                    }}
                  >
                    Quick Actions
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      if (stats?.lastActiveCourseID) {
                        router.push(
                          `/dashboard/${goalID}/courses/${stats.lastActiveCourseID}`
                        );
                      } else {
                        router.push(`/dashboard/${goalID}/courses`);
                      }
                    }}
                    sx={{
                      bgcolor: "#2563eb",
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1.5,
                      fontSize: "15px",
                      fontWeight: 600,
                      boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
                      "&:hover": {
                        bgcolor: "#1d4ed8",
                      },
                    }}
                  >
                    Resume Learning
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AccessTime />}
                    onClick={() => router.push(`/dashboard/${goalID}/exam`)}
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      textTransform: "none",
                      borderRadius: "10px",
                      py: 1.5,
                      fontSize: "15px",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        bgcolor: "#f8fafc",
                      },
                    }}
                  >
                    View Schedule
                  </Button>
                </Stack>

                {/* Contents Card */}
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "20px",
                    p: 3,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    maxHeight: "calc(100vh - 300px)",
                    overflowY: "auto",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 800,
                      mb: 2,
                      color: "#1e293b",
                    }}
                  >
                    Course Content
                  </Typography>
                  <GoalContents
                    blogList={blogList}
                    selectedBlog={selectedBlog}
                    onClick={getBlogData}
                  />
                </Box>
              </Stack>

              {/* MOBILE SIDEBAR */}
              <MobileSidebar
                blogList={blogList}
                selectedBlog={selectedBlog}
                onClick={getBlogData}
              />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
