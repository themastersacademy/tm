"use client";
import { Skeleton, Stack, Typography, CircularProgress } from "@mui/material";
import LessonCard from "@/src/Components/LessonCard.js/LessonCard";
import CheckoutCard from "@/src/Components/CheckoutCard.js/CheckoutCard";
import {
  ArrowBackIosNew,
  InsertDriveFile,
  Lock,
  PlayCircle,
  SaveAlt,
} from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import LessoncardSkeleton from "@/src/Components/SkeletonCards/LessoncardSkeleton";
import TranslateIcon from "@mui/icons-material/Translate";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import PauseCircle from "@mui/icons-material/PauseCircle";

export default function MyCourse() {
  const params = useParams();
  const { goalID, courseID } = params;
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState({});
  const [lessonList, setLessonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [initialLessonId, setInitialLessonId] = useState(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Fetch enrollment status
  const fetchEnrollmentStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/get-enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: courseID,
          }),
        }
      );
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        const enrollment = data.data[0];
        setIsEnrolled(enrollment.status === "active");
        setEnrollment(enrollment);
      } else {
        setIsEnrolled(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch enrollment status:", error);
      setIsEnrolled(false);
    } finally {
      setEnrollmentChecked(true);
    }
  }, [courseID]);

  // Fetch course details
  const fetchCourseDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: courseID,
            goalID: goalID,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setCourseDetails(data.data);
      } else {
        console.error("Failed to fetch course details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseID, goalID]);

  // Fetch lessons
  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: courseID,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setLessonList(data.data);
        PlayInitialVideo({
          lessons: data.data,
          setVideoLoading,
          setVideoPreview,
          setInitialLessonId,
          setSelectedLessonIndex,
          params,
        });
      } else {
        console.error("Failed to fetch lessons:", data.message);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseID, params]);

  useEffect(() => {
    fetchEnrollmentStatus();
  }, [courseID, goalID, fetchEnrollmentStatus]);

  useEffect(() => {
    fetchCourseDetails();
    fetchLessons();
  }, [goalID, enrollmentChecked, isEnrolled, fetchCourseDetails, fetchLessons]);

  // Handle lesson click
  const handleLessonClick = (item, index) => {
    if (selectedLessonId === item.id) {
      return; // If the lesson is already selected, do nothing
    }

    if (item.isPreview || isEnrolled) {
      setSelectedLessonId(item.id);
      setInitialLessonId(item.id);
      setSelectedLessonIndex(index + 1);
      if (item.type === "VIDEO") {
        VideoPlay({
          lessonID: item.id,
          setVideoLoading,
          setVideoPreview,
          params,
          enrollmentID: enrollment?.id || undefined,
        });
      }
    }
  };

  return (
    <Stack
      padding={{ xs: "10px", sm: "20px" }}
      alignItems="center"
      sx={{
        marginBottom: isEnrolled
          ? { xs: "0%", sm: "0%", md: "0px", lg: "0px" }
          : { xs: "40%", sm: "20%", md: "0px", lg: "0px" },
      }}
    >
      {isLoading ? (
        <PageSkeleton />
      ) : (
        <Stack gap="20px" width="100%" maxWidth="1200px">
          <Stack
            flexDirection="row"
            alignItems="center"
            gap="5px"
            sx={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--white)",
              borderRadius: "10px",
              padding: "10px 20px",
              width: "100%",
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
              {isLoading ? (
                <Skeleton variant="text" width="120px" />
              ) : (
                courseDetails?.title
              )}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "column", md: "row", lg: "row" }}
            gap={{ xs: "20px", lg: "30px" }}
            justifyContent="space-between"
          >
            <Stack gap="15px" flex={1} width="100%">
              <Stack>
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
                      aspectRatio: "16 / 9",
                      borderRadius: "15px",
                      overflow: "hidden",
                      backgroundColor: "black",
                    }}
                  >
                    <iframe
                      src={videoPreview}
                      style={{
                        borderRadius: "15px",
                        width: "100%",
                        maxWidth: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  </Stack>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="400px"
                    animation="wave"
                    sx={{
                      borderRadius: "15px",
                      backgroundColor: "var(--sec-color-acc-1)",
                    }}
                  />
                )}
              </Stack>
              <Stack
                flexWrap="wrap"
                flexDirection="row"
                gap="5px"
                justifyContent={{
                  xs: "center",
                  sm: "flex-start",
                  md: "flex-start",
                  lg: "flex-start",
                }}
                alignItems={{
                  xs: "center",
                  sm: "flex-start",
                  md: "flex-start",
                  lg: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                      md: "12px",
                      lg: "14px",
                    },
                    fontWeight: "400",
                    backgroundColor: "var(--sec-color-acc-1)",
                    padding: "5px 10px",
                    borderRadius: "2px",
                    color: "var(--sec-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    width: "fit-content",
                  }}
                >
                  <TranslateIcon sx={{ fontSize: "16px" }} />
                  {courseDetails?.language?.length > 0
                    ? courseDetails.language.join(", ")
                    : "No languages available"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                      md: "12px",
                      lg: "14px",
                    },
                    fontWeight: "400",
                    backgroundColor: "var(--sec-color-acc-1)",
                    padding: "5px 10px",
                    borderRadius: "2px",
                    color: "var(--sec-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <PlayLessonIcon sx={{ fontSize: "16px" }} />
                  {courseDetails?.lessons} Lessons
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: {
                      xs: "12px",
                      sm: "14px",
                      md: "12px",
                      lg: "14px",
                    },
                    fontWeight: "400",
                    backgroundColor: "var(--sec-color-acc-1)",
                    padding: "5px 10px",
                    borderRadius: "2px",
                    color: "var(--sec-color)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <AccessTimeFilledIcon sx={{ fontSize: "16px" }} />
                  {courseDetails?.duration} Hours
                </Typography>
              </Stack>

              {/* About this course */}
              <Stack
                sx={{
                  display: { xs: "none", sm: "none", md: "block", lg: "block" },
                }}
              >
                {courseDetails?.description && (
                  <Stack
                    sx={{
                      backgroundColor: "var(--white)",
                      padding: "20px 25px",
                      borderRadius: "10px",
                      maxHeight: "auto",
                      overflow: "auto",
                    }}
                  >
                    <MDPreview value={courseDetails.description} />
                  </Stack>
                )}
              </Stack>
            </Stack>

            {/* Checkout Card and Lectures */}
            <Stack
              gap="20px"
              alignItems={{
                xs: "center",
                sm: "flex-start",
                md: "flex-end",
                lg: "flex-end",
              }}
              flex={{ xs: "auto", sm: "auto", md: 0.6, lg: 0.6 }}
              width="100%"
              sx={{ marginBottom: { xs: "60px", md: "0px" } }}
            >
              {enrollmentChecked && !isEnrolled && (
                <Stack
                  width={{ xs: "300px", sm: "350px", md: "350px", lg: "350px" }}
                  maxWidth={{
                    xs: "300px",
                    sm: "350px",
                    md: "350px",
                    lg: "350px",
                  }}
                >
                  <CheckoutCard
                    courseDetails={courseDetails}
                    lessonList={lessonList}
                  />
                </Stack>
              )}

              <Stack
                width={{ xs: "100%", sm: "100%", md: "350px", lg: "auto" }}
                maxWidth={{ xs: "100%", sm: "100%", md: "100%", lg: "auto" }}
                gap="15px"
                alignItems="center"
              >
                <Stack
                  width="100%"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", sm: "20px" },
                      fontWeight: "700",
                      fontFamily: "Lato",
                    }}
                  >
                    Lectures
                  </Typography>
                  <Typography sx={{ fontSize: "16px", color: "var(--text3)" }}>
                    {selectedLessonIndex}/{lessonList.length}
                  </Typography>
                </Stack>

                {!isLoading ? (
                  lessonList.length > 0 ? (
                    lessonList.map((item, index) => {
                      const isAccessible = isEnrolled || item.isPreview;
                      const isInitialVideoId = item.id === initialLessonId;
                      const isInitialVideo =
                        item.type === "VIDEO" &&
                        item.isPreview &&
                        lessonList.find(
                          (lesson) =>
                            lesson.type === "VIDEO" && lesson.isPreview === true
                        )?.id === item.id;

                      return (
                        <LessonCard
                          key={index}
                          onClick={() => {
                            if (item.type === "VIDEO" && isAccessible) {
                              handleLessonClick(item, index);
                            }
                          }}
                          style={{
                            cursor:
                              item.type === "VIDEO" && isAccessible
                                ? "pointer"
                                : "not-allowed",
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
                              selectedLessonId === item.id ||
                              isInitialVideoId ? (
                                <PauseCircle
                                  sx={{
                                    color: isInitialVideoId
                                      ? "var(--sec-color)"
                                      : isAccessible
                                      ? "var(--sec-color)"
                                      : "var(--primary-color)",
                                  }}
                                />
                              ) : (
                                <PlayCircle
                                  sx={{
                                    color: isInitialVideoId
                                      ? "var(--sec-color)"
                                      : isAccessible
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
                                    FileDownload({
                                      lessonID: item.id,
                                      params,
                                      enrollmentID: enrollment?.id,
                                    });
                                  }}
                                />
                              ) : (
                                <Lock sx={{ color: "var(--primary-color)" }} />
                              )
                            ) : item.type === "VIDEO" && !isAccessible ? (
                              <Lock sx={{ color: "var(--primary-color)" }} />
                            ) : (
                              <></>
                            )
                          }
                          isPreview={item.isPreview}
                          isEnrolled={isEnrolled}
                          isSelected={selectedLessonId === item.id}
                          now={isInitialVideoId}
                        />
                      );
                    })
                  ) : (
                    <LessoncardSkeleton />
                  )
                ) : (
                  <>
                    <LessoncardSkeleton />
                    <LessoncardSkeleton />
                    <LessoncardSkeleton />
                    <LessoncardSkeleton />
                  </>
                )}
              </Stack>

              {/* About this course */}
              <Stack
                sx={{
                  display: { xs: "block", sm: "block", md: "none", lg: "none" },
                  width: "100%",
                }}
              >
                {courseDetails?.description && (
                  <Stack
                    sx={{
                      backgroundColor: "var(--white)",
                      padding: "20px 25px",
                      borderRadius: "10px",
                      maxHeight: "auto",
                      overflow: "auto",
                      marginTop: "20px",
                    }}
                  >
                    <MDPreview value={courseDetails.description} />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

// PlayInitialVideo and VideoPlay functions
const PlayInitialVideo = ({
  lessons,
  setVideoLoading,
  setVideoPreview,
  setInitialLessonId,
  setSelectedLessonIndex,
  params,
}) => {
  const firstPreviewVideoIndex = lessons.findIndex(
    (lesson) => lesson.type === "VIDEO" && lesson.isPreview === true
  );
  if (firstPreviewVideoIndex !== -1) {
    const firstPreviewVideo = lessons[firstPreviewVideoIndex];
    setInitialLessonId(firstPreviewVideo.id);
    setSelectedLessonIndex(firstPreviewVideoIndex + 1);
    VideoPlay({
      lessonID: firstPreviewVideo.id,
      setVideoLoading,
      setVideoPreview,
      params,
    });
  }
};

const VideoPlay = async ({
  lessonID,
  setVideoLoading,
  setVideoPreview,
  params,
  enrollmentID,
}) => {
  setVideoLoading(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/lessons/get-video-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonID: lessonID,
          courseID: params.courseID,
          enrollmentID: enrollmentID,
        }),
      }
    );

    const data = await response.json();
    if (data.success) {
      setVideoPreview(data.data);
    } else {
      setVideoPreview("");
      console.error("Failed to load video preview:", data.message);
    }
  } catch (error) {
    console.error("Failed to load video preview:", error);
    setVideoPreview("");
  } finally {
    setVideoLoading(false);
  }
};

const FileDownload = async ({ lessonID, params, enrollmentID }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/lessons/get-file-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonID: lessonID,
          courseID: params.courseID,
          enrollmentID: enrollmentID,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      triggerDownload(data.data);
    } else {
      console.error("Failed to download file:", data.message);
    }
  } catch (error) {
    console.error("Failed to download file:", error);
  }
};

const triggerDownload = (fileUrl) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
