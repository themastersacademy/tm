"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
} from "@mui/icons-material";
import LessonCard from "@/src/Components/LessonCard.js/LessonCard";
import CheckoutCard from "@/src/Components/CheckoutCard.js/CheckoutCard";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import LessoncardSkeleton from "@/src/Components/SkeletonCards/LessoncardSkeleton";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const MyCourse = () => {
  const { goalID, courseID } = useParams();
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState({});
  const [lessonList, setLessonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [error, setError] = useState(null);

  // Memoized API headers
  const apiHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
    }),
    []
  );

  // Fetch all course-related data
  const fetchCourseData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch enrollment status
      const enrollmentResponse = await fetch(
        `${API_BASE_URL}/api/courses/get-enroll`,
        {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({ courseID }),
        }
      );
      const enrollmentData = await enrollmentResponse.json();
      if (enrollmentData.success && enrollmentData.data?.length > 0) {
        const enrollmentInfo = enrollmentData.data[0];
        setIsEnrolled(enrollmentInfo.status === "active");
        setEnrollment(enrollmentInfo);
      } else {
        setIsEnrolled(false);
      }

      // Fetch course details
      const courseResponse = await fetch(`${API_BASE_URL}/api/courses`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({ courseID, goalID }),
      });
      const courseData = await courseResponse.json();
      if (courseData.success) {
        setCourseDetails(courseData.data);
      } else {
        throw new Error(courseData.message || "Failed to fetch course details");
      }

      // Fetch lessons
      const lessonsResponse = await fetch(
        `${API_BASE_URL}/api/courses/lessons`,
        {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify({ courseID }),
        }
      );
      const lessonsData = await lessonsResponse.json();
      if (lessonsData.success) {
        setLessonList(lessonsData.data);
        // Play the first preview video if available
        const firstPreviewVideoIndex = lessonsData.data.findIndex(
          (lesson) => lesson.type === "VIDEO" && lesson.isPreview
        );
        if (firstPreviewVideoIndex !== -1) {
          const firstPreviewVideo = lessonsData.data[firstPreviewVideoIndex];
          setSelectedLessonId(firstPreviewVideo.id);
          setSelectedLessonIndex(firstPreviewVideoIndex + 1);
          await playVideo({
            lessonID: firstPreviewVideo.id,
            courseID,
            setVideoLoading,
            setVideoPreview,
          });
        }
      } else {
        throw new Error(lessonsData.message || "Failed to fetch lessons");
      }
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError("Failed to load course data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [courseID, goalID, apiHeaders]);

  // Fetch course data on mount
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Handle lesson click
  const handleLessonClick = useCallback(
    (item, index) => {
      if (selectedLessonId === item.id || item.type !== "VIDEO") return; // Block selection for files
      if (item.isPreview || isEnrolled) {
        setSelectedLessonId(item.id);
        setSelectedLessonIndex(index + 1);
        playVideo({
          lessonID: item.id,
          courseID,
          enrollmentID: enrollment?.id,
          setVideoLoading,
          setVideoPreview,
        });
      }
    },
    [selectedLessonId, isEnrolled, enrollment, courseID]
  );

  // Handle file download
  const handleFileDownload = useCallback(
    async (lessonID) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/courses/lessons/get-file-url`,
          {
            method: "POST",
            headers: apiHeaders,
            body: JSON.stringify({
              lessonID,
              courseID,
              enrollmentID: enrollment?.id,
            }),
          }
        );
        const data = await response.json();
        if (data.success) {
          triggerDownload(data.data);
        } else {
          throw new Error(data.message || "Failed to download file");
        }
      } catch (err) {
        console.error("File download error:", err);
        setError("Failed to download file. Please try again.");
      }
    },
    [courseID, enrollment, apiHeaders]
  );

  // Memoized course info tags
  const courseInfoTags = useMemo(
    () => [
      {
        icon: <Translate sx={{ fontSize: "16px" }} />,
        text: courseDetails?.language?.join(", ") || "No languages available",
      },
      {
        icon: <PlayLesson sx={{ fontSize: "16px" }} />,
        text: `${courseDetails?.lessons || 0} Lessons`,
      },
      {
        icon: <AccessTimeFilled sx={{ fontSize: "16px" }} />,
        text: `${courseDetails?.duration || 0} Hours`,
      },
    ],
    [courseDetails]
  );

  if (isLoading) return <PageSkeleton />;

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        padding: { xs: "10px", sm: "20px" },
        alignItems: "center",
        marginBottom: isEnrolled ? 0 : { xs: "40%", sm: "20%", md: 0 },
      }}
    >
      <Stack gap="20px" width="100%" maxWidth="1200px">
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          gap="5px"
          sx={{
            border: "1px solid var(--border-color)",
            bgcolor: "var(--white)",
            borderRadius: "10px",
            p: "10px 20px",
            height: "50px",
          }}
        >
          <ArrowBackIosNew
            onClick={() => router.back()}
            sx={{ cursor: "pointer", fontSize: "18px" }}
          />
          <Typography
            sx={{ fontSize: { xs: "12px", sm: "16px" }, fontFamily: "Lato" }}
          >
            {courseDetails?.title || <Skeleton variant="text" width="120px" />}
          </Typography>
        </Stack>

        {/* Main Content */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={{ xs: "20px", lg: "30px" }}
          justifyContent="space-between"
        >
          {/* Video and Course Info */}
          <Stack gap="15px" flex={1}>
            {videoLoading ? (
              <Stack
                width="100%"
                height="500px"
                justifyContent="center"
                alignItems="center"
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
                  borderRadius: "15px",
                  overflow: "hidden",
                  bgcolor: "black",
                }}
              >
                <iframe
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
                height="400px"
                sx={{ borderRadius: "15px", bgcolor: "var(--sec-color-acc-1)" }}
              />
            )}

            {/* Course Info Tags */}
            <Stack
              direction="row"
              flexWrap="wrap"
              gap="5px"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              {courseInfoTags.map(({ icon, text }, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: "Lato",
                    fontSize: { xs: "12px", sm: "14px" },
                    fontWeight: 400,
                    bgcolor: "var(--sec-color-acc-1)",
                    p: "5px 10px",
                    borderRadius: "2px",
                    color: "var(--sec-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {icon}
                  {text}
                </Typography>
              ))}
            </Stack>

            {/* Course Description (Desktop) */}
            <Stack sx={{ display: { xs: "none", md: "block" } }}>
              {courseDetails?.description && (
                <Stack
                  sx={{
                    bgcolor: "var(--white)",
                    p: "20px 25px",
                    borderRadius: "10px",
                    overflow: "auto",
                  }}
                >
                  <MDPreview value={courseDetails.description} />
                </Stack>
              )}
            </Stack>
          </Stack>

          {/* Checkout and Lessons */}
          <Stack
            gap="20px"
            alignItems={{ xs: "center", md: "flex-end" }}
            flex={{ xs: "auto", md: 0.6 }}
            sx={{ mb: { xs: "60px", md: 0 } }}
          >
            {!isEnrolled && (
              <Stack width={{ xs: "100%", sm: "350px" }} maxWidth="350px">
                <CheckoutCard
                  courseDetails={courseDetails}
                  lessonList={lessonList}
                />
              </Stack>
            )}

            {/* Lessons List */}
            <Stack
              width={{ xs: "100%", md: "350px", lg: "auto" }}
              gap="15px"
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
                    fontSize: { xs: "18px", sm: "20px" },
                    fontWeight: 700,
                    fontFamily: "Lato",
                  }}
                >
                  Lectures
                </Typography>
                <Typography sx={{ fontSize: "16px", color: "var(--text3)" }}>
                  {selectedLessonIndex}/{lessonList.length}
                </Typography>
              </Stack>

              {lessonList.length > 0
                ? lessonList.map((item, index) => {
                    const isAccessible = isEnrolled || item.isPreview;
                    const isSelected = selectedLessonId === item.id;

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
                            isSelected ? (
                              <PauseCircle
                                sx={{
                                  color: isAccessible
                                    ? "var(--sec-color)"
                                    : "var(--primary-color)",
                                }}
                              />
                            ) : (
                              <PlayCircle
                                sx={{
                                  color: isAccessible
                                    ? "var(--sec-color)"
                                    : "var(--primary-color)",
                                }}
                              />
                            )
                          ) : (
                            <InsertDriveFile
                              sx={{
                                color: isAccessible
                                  ? "var(--sec-color)"
                                  : "var(--primary-color)",
                              }}
                            />
                          )
                        }
                        iconEnd={
                          item.type === "FILE" ? (
                            isAccessible ? (
                              <SaveAlt
                                sx={{
                                  color: "var(--sec-color)",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileDownload(item.id);
                                }}
                              />
                            ) : (
                              <Lock sx={{ color: "var(--primary-color)" }} />
                            )
                          ) : item.type === "VIDEO" && !isAccessible ? (
                            <Lock sx={{ color: "var(--primary-color)" }} />
                          ) : null
                        }
                        isPreview={item.isPreview}
                        isEnrolled={isEnrolled}
                        isSelected={isSelected}
                      />
                    );
                  })
                : Array.from({ length: 4 }).map((_, index) => (
                    <LessoncardSkeleton key={index} />
                  ))}
            </Stack>

            {/* Course Description (Mobile) */}
            <Stack sx={{ display: { xs: "block", md: "none" }, width: "100%" }}>
              {courseDetails?.description && (
                <Stack
                  sx={{
                    bgcolor: "var(--white)",
                    p: "20px 25px",
                    borderRadius: "10px",
                    overflow: "auto",
                    mt: "20px",
                  }}
                >
                  <MDPreview value={courseDetails.description} />
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

// Helper function to play video
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

// Helper function to trigger file download
const triggerDownload = (fileUrl) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default MyCourse;
