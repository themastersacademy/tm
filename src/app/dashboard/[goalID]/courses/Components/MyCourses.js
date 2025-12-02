"use client";
import { Box, Stack, Typography } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { East } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useCourses } from "@/src/app/context/CourseProvider";
import CourseStats from "./CourseStats";
import ContinueLearning from "./ContinueLearning";
import AchievementCard from "./AchievementCard";

export default function MyCourses() {
  const { goalID } = useParams();
  const router = useRouter();
  const { enrolledCourses, loading } = useCourses();

  const getCourseRoute = (courseId) =>
    `/dashboard/${goalID}/courses/${courseId}`;

  const hasCourses =
    Array.isArray(enrolledCourses) && enrolledCourses.length > 0;

  const handleCourseClick = (courseId) => {
    router.push(getCourseRoute(courseId));
  };

  // Add demo lastWatched for Continue Learning (you can get this from actual data)
  const coursesWithMeta = hasCourses
    ? enrolledCourses.map((course) => ({
        ...course,
        lastWatched: course.lastWatched || "2 days ago", // Demo data
      }))
    : [];

  return (
    <Box px={{ xs: 0, sm: 0 }} py={0} width="100%">
      <Stack gap="32px">
        {/* Course Stats Dashboard */}
        {!loading && hasCourses && (
          <CourseStats enrolledCourses={coursesWithMeta} />
        )}

        {/* Continue Learning Section */}
        {!loading && hasCourses && (
          <ContinueLearning
            courses={coursesWithMeta}
            onCourseClick={handleCourseClick}
          />
        )}

        {/* Achievement Card */}
        {!loading && hasCourses && (
          <AchievementCard enrolledCourses={coursesWithMeta} />
        )}

        {/* All Enrolled Courses Section */}
        {!loading && hasCourses && (
          <Stack gap="16px">
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text1)",
              }}
            >
              All My Courses
            </Typography>

            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent={{ xs: "center", sm: "flex-start" }}
              alignItems="flex-start"
              sx={{
                columnGap: { xs: "4px", md: "20px" },
                rowGap: "20px",
              }}
            >
              {coursesWithMeta.map((item, index) => {
                const courseUrl = getCourseRoute(item.id);

                return (
                  <Box
                    key={item.id}
                    sx={{
                      width: { xs: "100%", sm: "300px" },
                      animation: "fadeIn 0.4s ease",
                      "@keyframes fadeIn": {
                        from: {
                          opacity: 0,
                          transform: "translateY(10px)",
                        },
                        to: {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <CourseCard
                      title={item.title || "Untitled Course"}
                      thumbnail={item.thumbnail}
                      lessons={`${item.lessons || 0} Lessons`}
                      hours={`${item.duration || 0} min`}
                      Language={
                        Array.isArray(item.language)
                          ? item.language
                          : item.language
                          ? [item.language]
                          : []
                      }
                      progress={item.progress || 0}
                      difficulty={item.difficulty}
                      instructor={item.instructor}
                      isPro={item.isPro}
                      isFree={item.isFree}
                      actionButton={
                        <Box
                          sx={{
                            flex: 1,
                            padding: "10px 16px",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            borderRadius: "10px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            "&:hover": {
                              backgroundColor: "var(--primary-color-dark)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => router.push(courseUrl)}
                        >
                          <East sx={{ fontSize: 18 }} />
                          Continue Learning
                        </Box>
                      }
                      actionMobile={
                        <Box
                          sx={{
                            padding: "12px",
                            backgroundColor: "var(--primary-color)",
                            color: "white",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            "&:active": {
                              backgroundColor: "var(--primary-color-dark)",
                            },
                          }}
                          onClick={() => router.push(courseUrl)}
                        >
                          <East sx={{ fontSize: 18 }} />
                          Continue Learning
                        </Box>
                      }
                    />
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}

        {/* Empty State */}
        {!loading && !hasCourses && (
          <Stack
            width="100%"
            height="100%"
            minHeight="60vh"
            alignItems="center"
            justifyContent="center"
            gap="20px"
          >
            <NoDataFound info="No Courses are enrolled" />
            <Box
              sx={{
                padding: "12px 24px",
                backgroundColor: "var(--primary-color)",
                color: "white",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--primary-color-dark)",
                  transform: "translateY(-2px)",
                },
              }}
              onClick={() => router.push(`/dashboard/${goalID}/courses`)}
            >
              Browse Courses
            </Box>
          </Stack>
        )}

        {/* Loading State */}
        {loading && (
          <Stack
            flexWrap="wrap"
            direction="row"
            columnGap="20px"
            rowGap="20px"
            width="100%"
            justifyContent={{ xs: "center", sm: "flex-start" }}
          >
            {[...Array(4)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
