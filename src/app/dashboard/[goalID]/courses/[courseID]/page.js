"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton, Stack, Typography, CircularProgress } from "@mui/material";
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
        console.log("Progress saved successfully");
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
    <Stack
      sx={{
        p: { xs: 1, sm: 2 },
        alignItems: "center",
        mb: isEnrolled ? 0 : { xs: "40%", sm: "20%", md: 0 },
      }}
    >
      <Script
        src="https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js"
        onLoad={initializePlayer}
      />

      <Stack gap={2.5} width="100%" maxWidth="1200px">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{
            border: "1px solid var(--border-color)",
            bgcolor: "var(--white)",
            borderRadius: 2,
            px: 2.5,
            height: 50,
          }}
        >
          <ArrowBackIosNew
            onClick={() => router.back()}
            sx={{ cursor: "pointer", fontSize: 18 }}
          />
          <Typography sx={{ fontSize: { xs: 12, sm: 16 }, fontFamily: "Lato" }}>
            {courseDetails?.title || <Skeleton variant="text" width={120} />}
          </Typography>
        </Stack>

        {/* Main Content */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: 2.5, lg: 3.75 }}
          justifyContent="space-between"
        >
          {/* Video & Info */}
          <Stack gap={1.875} flex={1}>
            {/* Video Area */}
            {videoLoading ? (
              <Stack
                height={500}
                justifyContent="center"
                alignItems="center"
                width="100%"
              >
                <CircularProgress
                  sx={{ color: "var(--primary-color)" }}
                  size={50}
                />
              </Stack>
            ) : videoPreview ? (
              <Stack
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "black",
                }}
              >
                <iframe
                  ref={iframeRef}
                  id="bunny-stream-embed"
                  src={videoPreview}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </Stack>
            ) : (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={400}
                sx={{ borderRadius: 2, bgcolor: "var(--sec-color-acc-1)" }}
              />
            )}

            {/* Error Message */}
            {error && videoPreview && (
              <Typography color="error" sx={{ mt: 1, textAlign: "center" }}>
                {error}
              </Typography>
            )}

            {/* Tags */}
            <Stack
              direction="row"
              flexWrap="wrap"
              gap={0.625}
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              {courseInfoTags.map(({ icon, text }, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: "Lato",
                    fontSize: { xs: 12, sm: 14 },
                    fontWeight: 400,
                    bgcolor: "var(--sec-color-acc-1)",
                    px: 1.25,
                    py: 0.625,
                    borderRadius: 0.5,
                    color: "var(--sec-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.625,
                  }}
                >
                  {icon}
                  {text}
                </Typography>
              ))}
            </Stack>

            {/* Description (Desktop) */}
            {courseDetails?.description && (
              <Stack sx={{ display: { xs: "none", md: "block" } }}>
                <Stack
                  sx={{
                    bgcolor: "var(--white)",
                    p: 2.5,
                    borderRadius: 2,
                    overflow: "auto",
                  }}
                >
                  <MDPreview value={courseDetails.description} />
                </Stack>
              </Stack>
            )}
          </Stack>

          {/* Checkout + Lessons */}
          <Stack
            gap={2.5}
            alignItems={{ xs: "center", md: "flex-end" }}
            flex={{ xs: "auto", md: 0.6 }}
            sx={{ mb: { xs: 7.5, md: 0 } }}
          >
            {!isEnrolled && (
              <Stack width={{ xs: "100%", sm: 350 }} maxWidth={350}>
                <CheckoutCard
                  courseDetails={courseDetails}
                  lessonList={lessonList}
                  isPaidCourseForUser={isPaidCourseForUser}
                />
              </Stack>
            )}

            {/* Lessons */}
            <Stack
              width={{ xs: "100%", md: 350, lg: "auto" }}
              gap={1.875}
              alignItems="center"
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, sm: 20 },
                    fontWeight: 700,
                    fontFamily: "Lato",
                  }}
                >
                  Lectures
                </Typography>
                <Typography sx={{ fontSize: 16, color: "var(--text3)" }}>
                  {selectedLessonIndex}/{lessonList.length}
                </Typography>
              </Stack>

              {/* Lessons Render */}
              {lessonList.length > 0
                ? lessonList.map((item, index) => {
                    const isAccessible = isEnrolled || item.isPreview;
                    const isSelected = selectedLessonId === item.id;
                    const progress =
                      progressRef.current[item.id]?.progress || 0;
                    const isCompleted =
                      progressRef.current[item.id]?.isCompleted || false;

                    const commonIconProps = {
                      sx: {
                        color: isAccessible
                          ? "var(--sec-color)"
                          : "var(--primary-color)",
                        cursor: isAccessible ? "pointer" : "default",
                      },
                    };

                    return (
                      <LessonCard
                        key={item.id}
                        onClick={() => handleLessonClick(item, index)}
                        style={{
                          cursor:
                            item.type === "VIDEO" && isAccessible
                              ? "pointer"
                              : "default",
                          opacity: isAccessible ? 1 : 0.6,
                        }}
                        LessonName={
                          <span style={{ color: "var(--text1)" }}>
                            {item.title}
                          </span>
                        }
                        duration={item.duration}
                        iconStart={
                          item.type === "VIDEO" ? (
                            isSelected && isPlaying ? (
                              <PauseCircle
                                onClick={(e) => handlePlayPauseClick(e, false)}
                                {...commonIconProps}
                              />
                            ) : (
                              <PlayCircle
                                onClick={(e) => handlePlayPauseClick(e, true)}
                                {...commonIconProps}
                              />
                            )
                          ) : (
                            <InsertDriveFile sx={commonIconProps.sx} />
                          )
                        }
                        iconEnd={
                          item.type === "FILE" ? (
                            isAccessible ? (
                              <SaveAlt
                                sx={{ ...commonIconProps.sx }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileDownload(item.id);
                                }}
                              />
                            ) : (
                              <Lock sx={{ color: "var(--primary-color)" }} />
                            )
                          ) : !isAccessible ? (
                            <Lock sx={{ color: "var(--primary-color)" }} />
                          ) : isCompleted ? (
                            <CheckCircle
                              sx={{
                                color: "var(--primary-color)",
                              }}
                            />
                          ) : (
                            <CircularProgress
                              variant="determinate"
                              value={progress}
                              size={24}
                              sx={{ color: "var(--sec-color)" }}
                            />
                          )
                        }
                        isPreview={item.isPreview}
                        isEnrolled={isEnrolled}
                        isSelected={isSelected}
                      />
                    );
                  })
                : Array.from({ length: 4 }).map((_, i) => (
                    <LessoncardSkeleton key={i} />
                  ))}
            </Stack>

            {/* Description (Mobile) */}
            {courseDetails?.description && (
              <Stack
                sx={{
                  display: { xs: "block", md: "none" },
                  width: "100%",
                  mt: 2.5,
                  bgcolor: "var(--white)",
                  p: 2.5,
                  borderRadius: 2,
                  overflow: "auto",
                }}
              >
                <MDPreview value={courseDetails.description} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
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
