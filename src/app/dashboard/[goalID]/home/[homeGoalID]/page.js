"use client";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { InsertDriveFile, ShoppingBagRounded } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useSession } from "next-auth/react";

const fetchGoalDetails = async (goalID, signal) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/goal-details`,
    {
      method: "POST",
      body: JSON.stringify({ goalID }),
      signal,
    }
  );
  return res.json();
};

const fetchBlog = async (goalID, blogID, signal) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/get-blog`,
    {
      method: "POST",
      body: JSON.stringify({ goalID, blogID }),
      signal,
    }
  );
  return res.json();
};

export default function HomeGoalID() {
  const { homeGoalID } = useParams();
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;
  const { data: session } = useSession();
  const [goalDetails, setGoalDetails] = useState({});
  const [blogList, setBlogList] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [isBlogLoading, setIsBlogLoading] = useState(false);
  const pageLoading = isGoalLoading || isBlogLoading;

  // Fetch full goal data with blog list
  const getGoalData = useCallback(async () => {
    const controller = new AbortController();
    setIsGoalLoading(true);
    try {
      const data = await fetchGoalDetails(homeGoalID, controller.signal);
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
    return () => controller.abort();
  }, [homeGoalID]);

  const getBlogData = useCallback(
    async (blogID) => {
      const controller = new AbortController();
      setIsBlogLoading(true);
      try {
        const data = await fetchBlog(homeGoalID, blogID, controller.signal);
        if (data.success) setSelectedBlog(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Blog fetch error:", err);
      } finally {
        setIsBlogLoading(false);
      }
      return () => controller.abort();
    },
    [homeGoalID]
  );

  useEffect(() => {
    getGoalData();
  }, [getGoalData]);

  return (
    <Stack
      padding={{ xs: "10px", md: "20px" }}
      gap="20px"
      sx={{ minHeight: "100vh", marginBottom: { xs: "70px", md: "0px" } }}
      width="100%"
      alignItems="center"
    >
      {pageLoading ? (
        <PageSkeleton />
      ) : (
        <>
          <GoalHead
            title={
              isGoalLoading ? (
                <Skeleton variant="text" width="120px" />
              ) : (
                goalDetails.title
              )
            }
            icon={goalDetails.icon}
            isPro={session?.user?.accountType !== "PRO"}
          />

          <Stack
            flexDirection={{ xs: "column", md: "row" }}
            gap="15px"
            maxWidth="1200px"
            width="100%"
          >
            <Stack gap="15px" sx={{ flex: 1 }}>
              <Typography fontWeight={700} fontSize="20px" fontFamily="Lato">
                Overview
              </Typography>
              <Stack
                sx={{
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--white)",
                  borderRadius: "10px",
                  padding: { xs: "10px", md: "20px 25px" },
                  minWidth: "100%",
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
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Subjects
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap="10px">
                  {isGoalLoading ? (
                    [...Array(3)].map((_, i) => (
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
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Courses
                </Typography>
                {!isGoalLoading && goalDetails.coursesList?.length > 0 ? (
                  goalDetails.coursesList.map((course, i) => (
                    <CourseCard
                      key={i}
                      title={course.title}
                      thumbnail={course.thumbnail}
                      Language={course.language}
                      lessons={`${course.lessons} Lessons`}
                      hours={`${course.duration} hours`}
                      actionButton={
                        <Button
                          variant="text"
                          size="small"
                          onClick={() =>
                            router.push(
                              `/dashboard/${goalID}/courses/${course.id}`
                            )
                          }
                          sx={{
                            textTransform: "none",
                            color: "var(--primary-color)",
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
                          endIcon={<ShoppingBagRounded />}
                          sx={{
                            textTransform: "none",
                            color: "var(--white)",
                            backgroundColor: "var(--primary-color)",
                            borderRadius: "0px 0px 10px 10px",
                          }}
                          onClick={() => {
                            router.push(
                              `/dashboard/${goalID}/courses/${course.id}`
                            );
                          }}
                        >
                          Purchase
                        </Button>
                      }
                      progress={course.progress}
                    />
                  ))
                ) : isGoalLoading ? (
                  <Stack direction="row" gap="15px">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </Stack>
                ) : (
                  <NoDataFound info="No Courses Available" />
                )}
              </Stack>
              <Stack gap="15px">
                <Typography fontWeight={700} fontSize="14px" fontFamily="Lato">
                  Weekly Quizzes
                </Typography>
                <PracticeTest />
              </Stack>
            </Stack>
            <Stack
              display={{ xs: "none", md: "block" }}
              sx={{ minWidth: "240px", marginTop: "30px" }}
            >
              <Typography
                fontWeight={700}
                fontSize="20px"
                fontFamily="Lato"
                padding="10px"
                color="var(--sec-color)"
              >
                Contents
              </Typography>
              <GoalContents
                blogList={blogList}
                selectedBlog={selectedBlog}
                onClick={(blogID) => getBlogData(blogID)}
              />
            </Stack>
            <MobileSidebar
              blogList={blogList}
              selectedBlog={selectedBlog}
              onClick={(blogID) => getBlogData(blogID)}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
