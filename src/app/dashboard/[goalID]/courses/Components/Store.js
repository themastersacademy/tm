"use client";
import { Stack, Box, Typography } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { ShoppingBagRounded } from "@mui/icons-material";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useRouter, useParams } from "next/navigation";
import { useCourses } from "@/src/app/context/CourseProvider";
import LearningTips from "./LearningTips";

export default function Store() {
  const { goalID } = useParams();
  const router = useRouter();
  const { liveCourses, loading } = useCourses();

  const handleCourseClick = (courseId) => {
    router.push(`/dashboard/${goalID}/courses/${courseId}`);
  };

  return (
    <Stack width="100%" gap="32px">
      {/* Learning Tips Section */}
      <LearningTips />

      {/* All Courses Section */}
      <Stack gap="16px">
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text1)",
          }}
        >
          All Courses
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
          {!loading ? (
            Array.isArray(liveCourses) && liveCourses.length > 0 ? (
              liveCourses.map((item, index) => (
                <Box
                  key={item.id || index}
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
                    title={item.title}
                    thumbnail={item.thumbnail}
                    Language={
                      Array.isArray(item.language)
                        ? item.language
                        : [item.language]
                    }
                    lessons={`${item.lessons || 0} Lessons`}
                    hours={`${item.duration || 0} min`}
                    isPro={item.subscription?.isPro}
                    isFree={item.subscription?.isFree}
                    difficulty={item.difficulty}
                    instructor={item.instructor}
                    enrolledCount={item.enrolledCount}
                    actionButton={
                      <Box
                        sx={{
                          display: "flex",
                          gap: "8px",
                          width: "100%",
                        }}
                      >
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
                          onClick={() => handleCourseClick(item.id)}
                        >
                          <ShoppingBagRounded sx={{ fontSize: 18 }} />
                          View Details
                        </Box>
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
                        onClick={() => handleCourseClick(item.id)}
                      >
                        <ShoppingBagRounded sx={{ fontSize: 18 }} />
                        View Details
                      </Box>
                    }
                  />
                </Box>
              ))
            ) : (
              <Stack
                width="100%"
                minHeight="40vh"
                justifyContent="center"
                alignItems="center"
              >
                <NoDataFound info="No courses found for this goal" />
              </Stack>
            )
          ) : (
            <Stack
              flexWrap="wrap"
              direction="row"
              columnGap="20px"
              rowGap="20px"
              width="100%"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
