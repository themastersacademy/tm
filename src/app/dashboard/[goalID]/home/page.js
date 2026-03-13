"use client";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Header from "@/src/Components/Header/Header";
import CrackTest from "./Components/CrackTest";
import gate_cse from "@/public/icons/gate_cse.svg";
import banking from "@/public/icons/banking.svg";
import placements from "@/public/icons/placements.svg";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import Store from "../courses/Components/Store";
import { East, Assignment, AccessTime } from "@mui/icons-material";
import BannerCarousel from "@/src/Components/BannerCarousel/BannerCarousel";
import { useRouter, useParams } from "next/navigation";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import HeaderSkeleton from "@/src/Components/SkeletonCards/HeaderSkeleton";
import FAQSect from "./Components/FAQSect";
import HowDoes from "./Components/HowDoes";
import enroll from "@/public/images/enrollCourse.svg";
import graduate from "@/public/images/graduate.svg";
import achieve from "@/public/images/achieve.svg";
import InsightCard from "./Components/InsightCard";
import { useBanners } from "@/src/app/context/BannerProvider";
import { useGoals } from "@/src/app/context/GoalProvider";
import { useSession } from "next-auth/react";
import HeroDashboard from "./Components/HeroDashboard";
import AnnouncementBanner from "./Components/AnnouncementBanner";
import FeaturedGoalCard from "./Components/FeaturedGoalCard";
import { useState, useEffect } from "react";
import CountdownTimer from "@/src/Components/CountdownTimer/CountdownTimer";

export default function HomePage() {
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;

  const { data: session } = useSession();
  const { banners, loading: bannerLoading } = useBanners();
  const { goals, loading: goalLoading } = useGoals();

  const [announcements, setAnnouncements] = useState([]);
  const [featuredGoals, setFeaturedGoals] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [directExams, setDirectExams] = useState([]);
  const [directExamsLoading, setDirectExamsLoading] = useState(true);

  const isLoading = bannerLoading;

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("/api/homepage/announcements");
        const data = await response.json();
        if (data.success) {
          setAnnouncements(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Fetch featured goals
  useEffect(() => {
    const fetchFeaturedGoals = async () => {
      try {
        const response = await fetch("/api/homepage/featured-goals");
        const data = await response.json();
        if (data.success) {
          setFeaturedGoals(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch featured goals:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedGoals();
  }, []);

  useEffect(() => {
    const fetchDirectExams = async () => {
      try {
        const res = await fetch("/api/my-exams/get-schedule-exam");
        const data = await res.json();
        if (data.success) setDirectExams(data.data || []);
      } catch (err) {
        console.error("Failed to fetch assigned exams:", err);
      } finally {
        setDirectExamsLoading(false);
      }
    };
    fetchDirectExams();
  }, []);

  const handleGoalClick = (id) => {
    router.push(`/dashboard/${goalID}/home/${id}`);
  };

  const renderGoalIcon = (type) =>
    type === "castle" ? gate_cse : type === "org" ? banking : placements;

  // Calculate user stats
  const userStats = {
    coursesEnrolled: goals.filter((g) => g.enrolled).length,
    hoursCompleted: 0, // TODO: Calculate from course progress
    certificates: 0, // TODO: Calculate from completed courses
  };

  return (
    <>
      <MobileHeader />
      <Stack
        alignItems="center"
        width="100%"
        maxWidth="1200px"
        margin="0 auto"
        sx={{ marginBottom: { xs: "80px", md: "0px" } }}
      >
        <Stack padding={{ xs: "12px", md: "24px" }} gap="24px" width="100%">
          {/* Desktop Header */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {isLoading ? <HeaderSkeleton /> : <Header />}
          </Box>

          {/* Main Content */}
          {isLoading ? (
            <PageSkeleton />
          ) : (
            <>
              {/* Hero Dashboard */}
              <HeroDashboard userName={session?.user?.name} stats={userStats} />

              {/* Announcements */}
              {!loadingAnnouncements && announcements.length > 0 && (
                <AnnouncementBanner announcements={announcements} />
              )}

              {/* Banner Carousel */}
              <Box width="100%">
                <BannerCarousel banners={banners} />
              </Box>

              {/* Featured Goals Section */}
              {!loadingFeatured && featuredGoals.length > 0 && (
                <Stack gap="24px">
                  <Stack gap="8px">
                    <Typography
                      sx={{
                        fontSize: { xs: "18px", md: "20px" },
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      Featured Learning Paths
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "var(--text3)",
                        fontWeight: 500,
                      }}
                    >
                      Handpicked goals to accelerate your success
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    gap="20px"
                    sx={{
                      overflowX: "auto",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                    }}
                  >
                    {featuredGoals.map((goal) => (
                      <FeaturedGoalCard
                        key={goal.id}
                        goal={goal}
                        onExplore={() =>
                          router.push(`/dashboard/${goal.id}/home`)
                        }
                      />
                    ))}
                  </Stack>
                </Stack>
              )}

              {/* Your Learning Goals */}
              <Stack gap="24px">
                <Stack gap="8px">
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "20px" },
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    Your Learning Goals
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "var(--text3)",
                      fontWeight: 500,
                    }}
                  >
                    Track your progress and explore enrolled goals
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    overflowX: { xs: "auto", md: "initial" },
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    width: "100%",
                  }}
                >
                  <Stack
                    direction="row"
                    flexWrap={{ xs: "nowrap", md: "wrap" }}
                    gap="16px"
                  >
                    {goalLoading ? (
                      <>
                        <PrimaryCardSkeleton />
                        <PrimaryCardSkeleton />
                      </>
                    ) : goals.length > 0 ? (
                      goals.map((goal) => (
                        <PrimaryCard
                          key={goal.id}
                          title={goal.title}
                          icon={renderGoalIcon(goal.icon)}
                          enrolled={goal.enrolled}
                          actionButton={
                            <Button
                              variant="text"
                              endIcon={<East />}
                              onClick={() => handleGoalClick(goal.id)}
                              sx={{
                                textTransform: "none",
                                fontFamily: "Lato",
                                color: "var(--primary-color)",
                                fontSize: "14px",
                                p: "2px",
                              }}
                            >
                              Enrolled
                            </Button>
                          }
                        />
                      ))
                    ) : (
                      <NoDataFound info="No Goals are enrolled" />
                    )}
                  </Stack>
                </Box>
              </Stack>

              {/* Directly Assigned Exams */}
              {(directExamsLoading || directExams.length > 0) && (
                <Stack gap="16px">
                  <Stack direction="row" alignItems="center" gap="8px">
                    <Assignment sx={{ color: "var(--primary-color)", fontSize: "20px" }} />
                    <Typography
                      sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: 700, color: "var(--text1)" }}
                    >
                      Assigned Exams
                    </Typography>
                    {!directExamsLoading && (
                      <Chip
                        label={directExams.length}
                        size="small"
                        sx={{
                          backgroundColor: "var(--primary-color-acc-2)",
                          color: "var(--primary-color)",
                          fontWeight: 700,
                          fontSize: "12px",
                        }}
                      />
                    )}
                  </Stack>

                  <Stack gap="12px">
                    {directExamsLoading ? (
                      <Stack
                        sx={{
                          height: "80px",
                          borderRadius: "12px",
                          backgroundColor: "var(--bg1)",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      directExams.map((exam) => {
                        const now = Date.now();
                        const startDate = exam.startTimeStamp ? new Date(exam.startTimeStamp) : null;
                        const endDate = exam.endTimeStamp
                          ? new Date(exam.endTimeStamp)
                          : startDate
                            ? new Date(startDate.getTime() + (exam.duration || 60) * 60000)
                            : null;
                        const isNotStarted = startDate && now < startDate.getTime();
                        const isExpired = endDate && now > endDate.getTime();

                        return (
                          <Stack
                            key={exam.id}
                            direction={{ xs: "column", md: "row" }}
                            alignItems={{ xs: "flex-start", md: "center" }}
                            justifyContent="space-between"
                            gap="12px"
                            sx={{
                              backgroundColor: "var(--white)",
                              borderRadius: "12px",
                              padding: "16px 20px",
                              border: "1px solid var(--border-color)",
                              opacity: isExpired ? 0.6 : 1,
                            }}
                          >
                            <Stack gap="4px" flex={1}>
                              <Stack direction="row" alignItems="center" gap="8px">
                                <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "var(--text1)" }}>
                                  {exam.title}
                                </Typography>
                                {isExpired && (
                                  <Chip
                                    label="Expired"
                                    size="small"
                                    sx={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", fontSize: "11px", fontWeight: 600 }}
                                  />
                                )}
                              </Stack>
                              {startDate && (
                                <Stack direction="row" gap="12px" alignItems="center" flexWrap="wrap">
                                  <Stack direction="row" alignItems="center" gap="4px">
                                    <AccessTime sx={{ fontSize: "13px", color: "var(--text3)" }} />
                                    <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                                      {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                                      {startDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                                    </Typography>
                                  </Stack>
                                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                                    {exam.duration || 60} min · {exam.totalQuestions || 0} Qs · {exam.totalMarks || 0} marks
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>

                            {isNotStarted ? (
                              <Box sx={{ minWidth: { xs: "100%", md: "200px" } }}>
                                <CountdownTimer targetTime={exam.startTimeStamp} />
                              </Box>
                            ) : !isExpired ? (
                              <Button
                                variant="contained"
                                endIcon={<East />}
                                onClick={() => router.push(`/exam/${exam.id}`)}
                                disableElevation
                                sx={{
                                  textTransform: "none",
                                  backgroundColor: "var(--primary-color)",
                                  borderRadius: "10px",
                                  padding: "8px 20px",
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Start Exam
                              </Button>
                            ) : null}
                          </Stack>
                        );
                      })
                    )}
                  </Stack>
                </Stack>
              )}

              {/* Store Section for Mobile */}
              <Stack sx={{ display: { xs: "flex", md: "none" } }}>
                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "20px" },
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    Course Store
                  </Typography>
                  <Button
                    variant="text"
                    endIcon={<East />}
                    onClick={() => router.push(`/dashboard/${goalID}/courses`)}
                    sx={{
                      textTransform: "none",
                      color: "var(--primary-color)",
                      fontSize: "12px",
                    }}
                  >
                    View Store
                  </Button>
                </Stack>
                <Store />
              </Stack>

              {/* How It Works */}
              <Stack gap="24px">
                <Stack gap="8px">
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "20px" },
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    How It Works
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "var(--text3)",
                      fontWeight: 500,
                    }}
                  >
                    Your journey to success in three simple steps
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  gap="24px"
                  justifyContent={{ xs: "center", md: "space-between" }}
                >
                  <HowDoes
                    image={enroll}
                    title="01. Enroll Course"
                    description="Sign up and browse our courses. Choose those that align with your goals and interests, and enroll to start your learning journey."
                  />
                  <HowDoes
                    image={graduate}
                    title="02. Graduate"
                    description="Get guidance from expert tutors, graduate successfully, and receive a certification to validate your new skills."
                  />
                  <HowDoes
                    image={achieve}
                    title="03. Achieve"
                    description="Leverage your new skills and certification to advance your career and reach your goals. Stay connected for ongoing support."
                  />
                </Stack>
                <InsightCard />
              </Stack>

              {/* Conditional Crack Test */}
              {session?.user?.accountType !== "PRO" && <CrackTest />}
              <FAQSect />
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
