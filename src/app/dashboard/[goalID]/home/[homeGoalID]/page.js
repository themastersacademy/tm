"use client";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { InsertDriveFile, ShoppingBagRounded } from "@mui/icons-material";
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

export default function HomeGoalID() {
  const { homeGoalID: goalID } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [goalDetails, setGoalDetails] = useState({});
  const [blogList, setBlogList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  const pageLoading = isGoalLoading || isBlogLoading;

  const getBlogData = useCallback(
    async (blogID) => {
      const controller = new AbortController();
      setIsBlogLoading(true);
      try {
        const data = await fetchBlog(goalID, blogID, controller.signal);
        if (data.success) {
          // Normalize the blog object to match expected keys
          const normalizedBlog = {
            ...data.data,
            blogID: data.data.id, // Add blogID for compatibility
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
  }, [getGoalData]);

  const handlePurchase = (courseID) => {
    router.push(`/dashboard/${goalID}/courses/${courseID}`);
  };

  return (
    <Stack
      padding={{ xs: "10px", md: "20px" }}
      gap="20px"
      sx={{ minHeight: "100vh", mb: { xs: "70px", md: 0 } }}
      width="100%"
      alignItems="center"
    >
      {pageLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <GoalHead
            title={
              isGoalLoading ? <Skeleton width="120px" /> : goalDetails.title
            }
            icon={goalDetails.icon}
            isPro={session?.user?.accountType !== "PRO"}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap="15px"
            maxWidth="1200px"
            width="100%"
          >
            {/* LEFT COLUMN */}
            <Stack flex={1} gap="15px">
              {/* Overview */}
              <Typography fontWeight={700} fontSize="20px" fontFamily="Lato">
                Overview
              </Typography>
              <Stack
                sx={{
                  border: "1px solid var(--border-color)",
                  bgcolor: "var(--white)",
                  borderRadius: "10px",
                  p: { xs: "10px", md: "20px 25px" },
                  minHeight: { xs: "auto", md: "450px" },
                  gap: "15px",
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

              {/* Subjects */}
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Subjects
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="10px">
                  {isGoalLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <SecondaryCardSkeleton cardWidth="300px" key={i} />
                    ))
                  ) : goalDetails.subjectList?.length ? (
                    goalDetails.subjectList.map((subject, i) => (
                      <SecondaryCard
                        key={i}
                        title={subject.title}
                        cardWidth="300px"
                        icon={
                          <InsertDriveFile sx={{ color: "var(--sec-color)" }} />
                        }
                      />
                    ))
                  ) : (
                    <NoDataFound info="No Subjects Found" />
                  )}
                </Stack>
              </Stack>

              {/* Courses */}
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Courses
                </Typography>

                {isGoalLoading ? (
                  <Stack direction="row" gap="15px" flexWrap="wrap">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </Stack>
                ) : goalDetails.coursesList?.length ? (
                  <Stack direction="row" flexWrap="wrap" gap="15px">
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
                            }}
                          >
                            Purchase
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
                            }}
                            onClick={() => handlePurchase(course.id)}
                          >
                            Purchase
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
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Weekly Quizzes
                </Typography>
                <PracticeTest />
              </Stack>
            </Stack>

            {/* RIGHT COLUMN (Desktop) */}
            <Stack
              display={{ xs: "none", md: "block" }}
              sx={{ minWidth: "240px", mt: "30px" }}
            >
              <Typography
                fontWeight={700}
                fontSize="20px"
                fontFamily="Lato"
                p="10px"
                color="var(--sec-color)"
              >
                Contents
              </Typography>
              <GoalContents
                blogList={blogList}
                selectedBlog={selectedBlog}
                onClick={getBlogData}
              />
            </Stack>

            {/* MOBILE SIDEBAR */}
            <MobileSidebar
              blogList={blogList}
              selectedBlog={selectedBlog}
              onClick={getBlogData}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
