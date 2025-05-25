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

export default function Home() {
  const { data: session } = useSession();
  const [quiz, setQuiz] = useState([
    {
      title: "Week 1",
      icon: week1.src,
      button: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          Start Test
        </Button>
      ),
    },
    {
      title: "Week 2",
      icon: week2.src,
      button: (
        <Button
          variant="text"
          endIcon={<Lock />}
          sx={{
            textTransform: "none",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
          disabled
        >
          Start Test
        </Button>
      ),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuiz(quiz);
  }, []);

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
          sx={{ mb: { xs: "60px", md: "0px" } }}
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
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <StatisticCard
                  title="Total Practice"
                  count="25"
                  icon={practice}
                />
                <StatisticCard title="Total Mocks" count="3" icon={mocks} />
                <StatisticCard title="Total Hours" count="10" icon={hours} />
                <StatisticCard title="Courses" count="2" icon={courses} />
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
                <MyCourses/>
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
                Weekly Quiz
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap="15px">
                {!isLoading
                  ? quiz.length > 0
                    ? quiz.map((item, index) => (
                        <PrimaryCard
                          key={index}
                          title={item.title}
                          actionButton={item.button}
                          icon={item.icon}
                        />
                      ))
                    : "No data found"
                  : [...Array(3)].map((_, index) => (
                      <PrimaryCardSkeleton key={index} />
                    ))}
              </Stack>
            </Stack>

            {/* Right Side */}
            <Stack
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
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
