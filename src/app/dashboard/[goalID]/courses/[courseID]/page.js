"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Skeleton,
  Stack,
  Typography,
  CircularProgress,
  Grid,
  Box,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import {
  ArrowBackIosNew,
  InsertDriveFile,
  Lock,
  PlayCircle,
  PauseCircle,
  Translate,
  PlayLesson,
  AccessTimeFilled,
  SaveAlt,
  CheckCircle,
} from "@mui/icons-material";
import LessonCard from "@/src/Components/LessonCard.js/LessonCard";
import CheckoutCard from "@/src/Components/CheckoutCard.js/CheckoutCard";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import LessoncardSkeleton from "@/src/Components/SkeletonCards/LessoncardSkeleton";
import Script from "next/script";
import { useSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const MyCourse = () => {
  const router = useRouter();
  const { goalID, courseID } = useParams();
  const [courseDetails, setCourseDetails] = useState({});
  const [lessonList, setLessonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const { data: session } = useSession();

  const progressRef = useRef({});
  const [renderTick, setRenderTick] = useState(0);
  const lastTickRef = useRef(0); // Persist last tick timestamp

  const apiHeaders = useMemo(
    () => ({ "Content-Type": "application/json" }),
    []
  );

  const saveProgressToDB = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/courses/analytics/save-progress`,
        {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({
            courseID,
            lessonProgress: progressRef.current,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
      } else {
        console.error("Failed to save progress:", data.message);
      }
    } catch (err) {
      console.error("Error saving progress to DB:", err);
    }
  }, [courseID, apiHeaders]);

  const initializePlayer = useCallback(() => {
    if (iframeRef.current && window.playerjs) {
      const player = new window.playerjs.Player(iframeRef.current);
      playerRef.current = player;

      player.on("ready", () => {
        const currentTime =
          progressRef.current[selectedLessonId]?.currentTime || 0;
        player.setCurrentTime(currentTime);
      });

      player.on("play", () => setIsPlaying(true));
      player.on("pause", () => {
        setIsPlaying(false);
      });

      player.on("timeupdate", ({ seconds, duration }) => {
        const progress = (seconds / duration) * 100;

        progressRef.current[selectedLessonId] = {
          progress,
          currentTime: seconds,
          isCompleted:
            progressRef.current[selectedLessonId]?.isCompleted ||
            progress >= 100,
        };

        // Re-render throttled to once every second
        // const now = Date.now();
        // if (now - lastTickRef.current > 1000) {
        setRenderTick((t) => t + 1); // force re-render
        //   lastTickRef.current = now;
        // }
      });

      player.on("ended", () => {
        const progressData = {
          progress: 100,
          currentTime: 0,
          isCompleted: true,
        };
        progressRef.current[selectedLessonId] = progressData;

        // if (lessonList.find((l) => l.id === selectedLessonId)?.isPreview) {
        saveProgressToDB(selectedLessonId, progressData);
        // }

        setIsPlaying(false);
        setRenderTick((t) => t + 1);
      });

      player.on("error", () => {
        setError("Failed to control video playback. Please try again.");
      });
    }
  }, [selectedLessonId, saveProgressToDB]);

  useEffect(() => {
    setLessonProgress((prev) => ({
      ...prev,
      [selectedLessonId]: progressRef.current,
    }));
  }, [selectedLessonId]);

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdatedAt > 30000) {
      saveProgressToDB();
      setLastUpdatedAt(now);
    }
  }, [lastUpdatedAt, renderTick, saveProgressToDB]);

  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [enrollRes, courseRes, lessonsRes, progressRes] = await Promise.all(
        [
          fetch(`${API_BASE_URL}/api/courses/get-enroll`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({ courseID }),
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/courses`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({ courseID, goalID }),
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/courses/lessons`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({ courseID }),
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/courses/get-progress`, {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({ courseID }),
            credentials: "include",
          }),
        ]
      );

      const [enrollData, courseData, lessonsData, progressData] =
        await Promise.all([
          enrollRes.json(),
          courseRes.json(),
          lessonsRes.json(),
          progressRes.json(),
        ]);

      if (enrollData.success && enrollData.data?.length > 0) {
        const enrollmentInfo = enrollData.data[0];
        setIsEnrolled(enrollmentInfo.status === "active");
        setEnrollment(enrollmentInfo);
      }

      if (!courseData.success) throw new Error(courseData.message);
      setCourseDetails(courseData.data);

      if (!lessonsData.success) throw new Error(lessonsData.message);
      setLessonList(lessonsData.data);

      if (progressData.success) {
        progressRef.current = { ...progressData.data };
        setRenderTick((t) => t + 1); // re-render to show existing progress
      }

      const firstPreview = lessonsData.data.find(
        (lesson) => lesson.type === "VIDEO" && lesson.isPreview
      );
      if (firstPreview) {
        setSelectedLessonId(firstPreview.id);
        setSelectedLessonIndex(lessonsData.data.indexOf(firstPreview) + 1);
        await playVideo({
          lessonID: firstPreview.id,
          courseID,
          setVideoLoading,
          setVideoPreview,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load course data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [courseID, goalID, apiHeaders]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    if (videoPreview && iframeRef.current) {
      initializePlayer();
    }
  }, [videoPreview, initializePlayer]);

  const handleLessonClick = useCallback(
    (item, index) => {
      if (item.type !== "VIDEO" || (!item.isPreview && !isEnrolled)) return;

      const isSame = selectedLessonId === item.id;

      if (isSame && playerRef.current) {
        isPlaying ? playerRef.current.pause() : playerRef.current.play();
      } else {
        setSelectedLessonId(item.id);
        setSelectedLessonIndex(index + 1);
        setIsPlaying(true);
        playVideo({
          lessonID: item.id,
          courseID,
          enrollmentID: enrollment?.id,
          setVideoLoading,
          setVideoPreview,
        });
      }
    },
    [selectedLessonId, isEnrolled, enrollment, courseID, isPlaying]
  );

  const handlePlayPauseClick = (e, shouldPlay) => {
    e.stopPropagation();
    if (!playerRef.current) {
      setError("Video player is not ready.");
      return;
    }
    shouldPlay ? playerRef.current.play() : playerRef.current.pause();
  };

  const handleFileDownload = useCallback(
    async (lessonID) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/courses/lessons/get-file-url`,
          {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({
              lessonID,
              courseID,
              enrollmentID: enrollment?.id,
            }),
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          const link = document.createElement("a");
          link.href = data.data;
          link.download = "resource";
          link.click();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError("Failed to download file.");
      }
    },
    [courseID, enrollment, apiHeaders]
  );

  const courseInfoTags = useMemo(
    () => [
      {
        icon: <Translate sx={{ fontSize: 16 }} />,
        text: courseDetails?.language?.join(", ") || "N/A",
      },
      {
        icon: <PlayLesson sx={{ fontSize: 16 }} />,
        text: `${courseDetails?.lessons || 0} Lessons`,
      },
      {
        icon: <AccessTimeFilled sx={{ fontSize: 16 }} />,
        text: `${courseDetails?.duration || 0} Hours`,
      },
    ],
    [courseDetails]
  );

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate Analytics
  const analytics = useMemo(() => {
    const totalLessons = lessonList.length || 1;
    const completedLessons = Object.values(progressRef.current).filter(
      (p) => p.isCompleted
    ).length;
    const progressPercentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    let totalSecondsWatched = 0;
    Object.values(progressRef.current).forEach((p) => {
      totalSecondsWatched += p.currentTime || 0;
    });

    const hours = Math.floor(totalSecondsWatched / 3600);
    const minutes = Math.floor((totalSecondsWatched % 3600) / 60);
    const timeSpent = `${hours}h ${minutes}m`;

    return {
      completedLessons,
      totalLessons,
      progressPercentage,
      timeSpent,
    };
  }, [lessonList, renderTick]);

  if (isLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress sx={{ color: "var(--primary-color)" }} />
      </Stack>
    );
  }
  const userType = session?.user?.accountType;

  const isPaidCourseForUser =
    (userType === "FREE" && !courseDetails?.subscription.isFree) ||
    (userType === "PRO" &&
      !courseDetails?.subscription.isFree &&
      !courseDetails?.subscription.isPro);

  return (
    <Box sx={{ pb: 8 }}>
      <Script
        src="https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js"
        onLoad={initializePlayer}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
          pt: { xs: 3, md: 4 },
          pb: { xs: 10, md: 14 },
          px: { xs: 2, md: 4 },
          color: "var(--white)",
          mb: -10,
        }}
      >
        <Box maxWidth="1400px" mx="auto">
          {/* Breadcrumb */}
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              mb: 2,
              cursor: "pointer",
              width: "fit-content",
              opacity: 0.7,
              "&:hover": { opacity: 1 },
            }}
            onClick={() => router.back()}
          >
            <ArrowBackIosNew sx={{ fontSize: 12, color: "inherit" }} />
            <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
              Back to Courses
            </Typography>
          </Stack>

          <Grid container spacing={4} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <Typography
                sx={{
                  fontSize: { xs: "24px", md: "32px" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 1.5,
                }}
              >
                {courseDetails?.title || <Skeleton width="60%" />}
              </Typography>
              <Stack direction="row" gap={3} flexWrap="wrap">
                <Stack direction="row" gap={1} alignItems="center">
                  <PlayLesson sx={{ fontSize: 18, opacity: 0.7 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                    {lessonList.length} Lessons
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <AccessTimeFilled sx={{ fontSize: 18, opacity: 0.7 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                    {courseDetails?.duration || 0} Hours
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                  <Translate sx={{ fontSize: 18, opacity: 0.7 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                    {courseDetails?.language?.join(", ") || "English"}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box maxWidth="1400px" mx="auto" px={{ xs: 2, md: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column: Video & Tabs */}
          <Grid item xs={12} lg={8}>
            <Stack gap={3}>
              {/* Video Player */}
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "24px",
                  overflow: "hidden",
                  bgcolor: "#000",
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.3)",
                  position: "relative",
                  border: "4px solid var(--white)",
                  zIndex: 10,
                }}
              >
                {videoLoading ? (
                  <Stack
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CircularProgress sx={{ color: "white" }} />
                  </Stack>
                ) : videoPreview ? (
                  <iframe
                    ref={iframeRef}
                    id="bunny-stream-embed"
                    src={videoPreview}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <Stack
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      bgcolor: "var(--library-expand)",
                      backgroundImage:
                        "radial-gradient(var(--border-color) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  >
                    <PlayCircle sx={{ fontSize: 64, color: "var(--text4)" }} />
                    <Typography
                      sx={{ mt: 2, color: "var(--text3)", fontWeight: 600 }}
                    >
                      Select a lesson to start watching
                    </Typography>
                  </Stack>
                )}
              </Box>

              {/* Tabs */}
              <Box>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTabs-indicator": { display: "none" },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "15px",
                      mr: 1,
                      borderRadius: "100px",
                      minHeight: "40px",
                      px: 3,
                      color: "var(--text3)",
                      "&.Mui-selected": {
                        color: "var(--white)",
                        bgcolor: "var(--primary-color)",
                      },
                    },
                  }}
                >
                  <Tab label="Overview" />
                  <Tab label="Curriculum" />
                </Tabs>
              </Box>

              {/* Tab Content */}
              <Box sx={{ py: 1 }}>
                {tabValue === 0 && (
                  <Stack gap={3}>
                    {/* Description */}
                    <Box
                      sx={{
                        bgcolor: "var(--white)",
                        p: 4,
                        borderRadius: "24px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 800,
                          mb: 3,
                          color: "var(--text1)",
                        }}
                      >
                        About this Course
                      </Typography>
                      <MDPreview
                        value={
                          courseDetails?.description ||
                          "No description available."
                        }
                      />
                    </Box>
                  </Stack>
                )}

                {tabValue === 1 && (
                  <Stack gap={2}>
                    {lessonList.length > 0
                      ? lessonList.map((item, index) => {
                          const isAccessible = isEnrolled || item.isPreview;
                          const isSelected = selectedLessonId === item.id;
                          const progress =
                            progressRef.current[item.id]?.progress || 0;
                          const isCompleted =
                            progressRef.current[item.id]?.isCompleted || false;
                          const lessonTime =
                            progressRef.current[item.id]?.currentTime || 0;

                          return (
                            <Stack
                              key={item.id}
                              direction="row"
                              alignItems="center"
                              gap={2}
                              onClick={() => handleLessonClick(item, index)}
                              sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: isSelected
                                  ? "var(--primary-color-acc-2)"
                                  : "var(--white)",
                                border: "1px solid",
                                borderColor: isSelected
                                  ? "var(--primary-color-acc-1)"
                                  : "var(--border-color)",
                                cursor:
                                  item.type === "VIDEO" && isAccessible
                                    ? "pointer"
                                    : "default",
                                opacity: isAccessible ? 1 : 0.6,
                                transition: "all 0.2s",
                                "&:hover": {
                                  bgcolor: isSelected
                                    ? "var(--primary-color-acc-2)"
                                    : "var(--library-expand)",
                                  transform: isAccessible
                                    ? "translateY(-2px)"
                                    : "none",
                                },
                              }}
                            >
                              {/* Icon */}
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: "12px",
                                  bgcolor: isSelected
                                    ? "var(--primary-color)"
                                    : "var(--library-expand)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: isSelected
                                    ? "var(--white)"
                                    : "var(--text3)",
                                  flexShrink: 0,
                                }}
                              >
                                {item.type === "VIDEO" ? (
                                  isSelected && isPlaying ? (
                                    <PauseCircle sx={{ fontSize: 24 }} />
                                  ) : (
                                    <PlayCircle sx={{ fontSize: 24 }} />
                                  )
                                ) : (
                                  <InsertDriveFile sx={{ fontSize: 24 }} />
                                )}
                              </Box>

                              {/* Content */}
                              <Stack flex={1} gap={0.5}>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color: isSelected
                                      ? "var(--text1)"
                                      : "var(--text2)",
                                  }}
                                >
                                  {index + 1}. {item.title}
                                </Typography>
                                <Stack
                                  direction="row"
                                  gap={2}
                                  alignItems="center"
                                >
                                  {item.duration > 0 && (
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        color: "var(--text3)",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {Math.floor(item.duration / 60)}m{" "}
                                      {item.duration % 60}s
                                    </Typography>
                                  )}
                                  {lessonTime > 0 && (
                                    <Typography
                                      sx={{
                                        fontSize: "13px",
                                        color: "var(--primary-color)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {Math.floor(lessonTime / 60)}m{" "}
                                      {Math.floor(lessonTime % 60)}s watched
                                    </Typography>
                                  )}
                                </Stack>
                              </Stack>

                              {/* Status */}
                              <Box>
                                {item.type === "FILE" ? (
                                  isAccessible ? (
                                    <SaveAlt
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFileDownload(item.id);
                                      }}
                                      sx={{
                                        color: "var(--text3)",
                                        "&:hover": {
                                          color: "var(--primary-color)",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <Lock sx={{ color: "var(--text4)" }} />
                                  )
                                ) : !isAccessible ? (
                                  <Lock sx={{ color: "var(--text4)" }} />
                                ) : isCompleted ? (
                                  <CheckCircle
                                    sx={{
                                      color: "var(--primary-color)",
                                      fontSize: 24,
                                    }}
                                  />
                                ) : progress > 0 ? (
                                  <CircularProgress
                                    variant="determinate"
                                    value={progress}
                                    size={24}
                                    thickness={5}
                                    sx={{ color: "var(--primary-color)" }}
                                  />
                                ) : (
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: "50%",
                                      border: "2px solid var(--border-color)",
                                    }}
                                  />
                                )}
                              </Box>
                            </Stack>
                          );
                        })
                      : Array.from({ length: 4 }).map((_, i) => (
                          <LessoncardSkeleton key={i} />
                        ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>

          {/* Right Column: Sidebar */}
          <Grid item xs={12} lg={4}>
            <Stack gap={3} position="sticky" top={24}>
              {!isEnrolled ? (
                <CheckoutCard
                  courseDetails={courseDetails}
                  lessonList={lessonList}
                  isPaidCourseForUser={isPaidCourseForUser}
                />
              ) : (
                <Box
                  sx={{
                    bgcolor: "var(--white)",
                    p: 3,
                    borderRadius: "24px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 800,
                      mb: 3,
                      color: "var(--text1)",
                    }}
                  >
                    Course Analytics
                  </Typography>

                  <Stack gap={2.5}>
                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text3)",
                          }}
                        >
                          Progress
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--text1)",
                          }}
                        >
                          {analytics.progressPercentage}%
                        </Typography>
                      </Stack>
                      <Box
                        sx={{
                          width: "100%",
                          height: 8,
                          bgcolor: "var(--library-expand)",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${analytics.progressPercentage}%`,
                            height: "100%",
                            bgcolor: "#3b82f6",
                            borderRadius: "4px",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                    </Box>

                    <Stack direction="row" gap={2}>
                      <Box
                        flex={1}
                        sx={{
                          p: 2,
                          bgcolor: "#f8fafc",
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#64748b",
                            mb: 0.5,
                          }}
                        >
                          Time Spent
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: "#1e293b",
                          }}
                        >
                          {analytics.timeSpent}
                        </Typography>
                      </Box>
                      <Box
                        flex={1}
                        sx={{
                          p: 2,
                          bgcolor: "#f8fafc",
                          borderRadius: "16px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#64748b",
                            mb: 0.5,
                          }}
                        >
                          Completed
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "18px",
                            fontWeight: 800,
                            color: "#1e293b",
                          }}
                        >
                          {analytics.completedLessons}/{analytics.totalLessons}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const playVideo = async ({
  lessonID,
  courseID,
  enrollmentID,
  setVideoLoading,
  setVideoPreview,
}) => {
  setVideoLoading(true);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/lessons/get-video-url`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonID, courseID, enrollmentID }),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.success) {
      setVideoPreview(data.data);
    } else {
      throw new Error(data.message || "Failed to load video");
    }
  } catch (error) {
    console.error("Video play error:", error);
    setVideoPreview("");
  } finally {
    setVideoLoading(false);
  }
};

export default MyCourse;
