"use client";
import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { East, Lock } from "@mui/icons-material";
import Header from "@/src/Components/Header/Header";
import StatisticCard from "@/src/Components/StatisticCard/StatisticCard";
import practice from "@/public/icons/practice.svg";
import mocks from "@/public/icons/mocks.svg";
import hours from "@/public/icons/hours.svg";
import courses from "@/public/icons/courses.svg";
import week1 from "@/public/icons/week1.svg";
import week2 from "@/public/icons/week2.svg";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import MyCourses from "./courses/Components/MyCourses";
import Subscribe from "../Components/Subscribe";
import DailyProgress from "../Components/DailyProgress";
import Leaderboard from "../Components/Leaderboard";
import { useSession } from "next-auth/react";
import { useExams } from "../../context/ExamProvider";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import SchoolIcon from "@mui/icons-material/School";
import { useCourses } from "../../context/CourseProvider";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";

export default function Home() {
  const { data: session } = useSession();
  const { mock, loading } = useExams();
  const [isLoading, setIsLoading] = useState(false);
  const [totalClassroomJoins, setTotalClassroomJoins] = useState(0);
  const router = useRouter();
  const { goalID } = useParams();

  useEffect(() => {
    setIsLoading(loading);
  }, []);

  useEffect(() => {
    const fetchTotalClassroomJoins = async () => {
      const response = await fetch("/api/my-classroom/total-count");
      const data = await response.json();
      if (data.success) {
        setTotalClassroomJoins(data.data.count);
      }
    };
    fetchTotalClassroomJoins();
  }, []);

  const { enrolledCourses, load } = useCourses();

  const getCourseRoute = (courseId) =>
    `/dashboard/${goalID}/courses/${courseId}`;
  const hasCourses =
    Array.isArray(enrolledCourses) && enrolledCourses.length > 0;

  return (
    <>
      <MobileHeader />
      <Stack
        gap="20px"
        padding="20px"
        alignItems="center"
        width="100%"
        maxWidth="1200px"
        margin="0 auto"
        sx={{ px: { xs: 1, md: 3 } }}
      >
        <Stack
          width="100%"
          maxWidth="1200px"
          gap="20px"
          sx={{ mb: { xs: "80px", md: "0px" } }}
        >
          <Header />
          {/* Main Content */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={{ xs: 4, md: 5 }}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            {/* Left Side */}
            <Stack flex={1} gap="20px" width="100%">
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "700",
                  display: { xs: "none", md: "block" },
                }}
              >
                Dashboard
              </Typography>

              {/* Stats Cards */}
              <Stack
                direction="row"
                rowGap="10px"
                columnGap="4px"
                flexWrap="wrap"
                justifyContent={{ xs: "space-between", md: "flex-start" }}
              >
                <StatisticCard
                  title="Total Practice"
                  count="25"
                  icon={practice}
                />
                <StatisticCard title="Total Mocks" count="3" icon={mocks} />
                <StatisticCard title="Total Hours" count="10" icon={hours} />
                <StatisticCard title="Courses" count="2" icon={courses} />
                <StatisticCard
                  title="Total Classroom "
                  count={totalClassroomJoins}
                  icon={courses}
                />
              </Stack>

              {/* My Courses - only on mobile */}
              <Stack sx={{ display: { xs: "block", md: "none" } }}>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "20px",
                    fontWeight: "700",
                    mb: 1,
                  }}
                >
                  My Courses
                </Typography>
                <MyCourses />
              </Stack>

              {/* Subscribe */}
              {session?.user?.accountType !== "PRO" && <Subscribe />}

              {/* Weekly Quiz Section */}
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Available Exams
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap="15px">
                {!loading
                  ? mock.length > 0
                    ? mock.map((item, index) => (
                        <PrimaryCard
                          key={index}
                          title={item.title}
                          actionButton={
                            <Button
                              variant="text"
                              endIcon={<East />}
                              onClick={() => router.push(`/exam/${item.id}`)}
                              sx={{
                                textTransform: "none",
                                color: "var(--primary-color)",
                                fontSize: "12px",
                              }}
                            >
                              Take Test
                            </Button>
                          }
                          icon={week1.src}
                        />
                      ))
                    : "No data found"
                  : [...Array(3)].map((_, index) => (
                      <PrimaryCardSkeleton key={index} />
                    ))}
              </Stack>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                My Courses
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap="15px">
                {!loading ? (
                  hasCourses ? (
                    enrolledCourses.map((item) => {
                      const courseUrl = getCourseRoute(item.id);

                      return (
                        <CourseCard
                          key={item.id}
                          title={item.title || "Untitled Course"}
                          thumbnail={item.thumbnail}
                          lessons={`${item.lessons || 0} Lessons`}
                          hours={`${item.duration || 0} min`}
                          Language={item.language || "N/A"}
                          actionButton={
                            <Button
                              variant="text"
                              endIcon={<East sx={{ width: 16, height: 16 }} />}
                              onClick={() => router.push(courseUrl)}
                              sx={{
                                color: "white",
                                textTransform: "none",
                                fontSize: "13px",
                                height: "24px",
                                width: "80px",
                              }}
                            >
                              View
                            </Button>
                          }
                          actionMobile={
                            <Button
                              variant="contained"
                              endIcon={<East sx={{ width: 16, height: 16 }} />}
                              onClick={() => router.push(courseUrl)}
                              sx={{
                                textTransform: "none",
                                color: "white",
                                backgroundColor: "var(--primary-color)",
                                borderRadius: "0px 0px 10px 10px",
                              }}
                            >
                              View
                            </Button>
                          }
                        />
                      );
                    })
                  ) : (
                    <Stack
                      width="100%"
                      height="100%"
                      minHeight="60vh"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <NoDataFound info="No Courses are enrolled" />
                    </Stack>
                  )
                ) : (
                  <CourseCardSkeleton />
                )}
              </Stack>
            </Stack>

            {/* Right Side */}
            {/* <Stack
              width={{ xs: "100%", md: "350px" }}
              flexShrink={0}
              gap="20px"
              alignSelf={{ xs: "stretch", md: "flex-start" }}
            >
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Daily Progress
              </Typography>

              <Stack
                sx={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "10px",
                  backgroundColor: "var(--white)",
                  height: "320px",
                }}
              >
                <DailyProgress />
              </Stack>
              <Leaderboard />
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
