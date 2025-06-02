"use client";
import { Box, Button, Stack } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { East } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useCourses } from "@/src/app/context/CourseProvider";

export default function MyCourses() {
  const { goalID } = useParams();
  const router = useRouter();
  const { enrolledCourses, loading } = useCourses();

  const getCourseRoute = (courseId) =>
    `/dashboard/${goalID}/courses/${courseId}`;
  const hasCourses =
    Array.isArray(enrolledCourses) && enrolledCourses.length > 0;

  return (
    <Box px={{ xs: 1, sm: 2 }} py={2} width="100%">
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        alignItems="stretch"
        sx={{
          columnGap: { xs: 1, sm: 2, md: 3 },
          rowGap: { xs: 2, sm: 3 },
          width: "100%",
        }}
      >
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
                  hours={`${item.duration || 0} minutes`}
                  Language={item.language || "N/A"}
                  actionButton={
                    <Button
                      variant="text"
                      endIcon={<East />}
                      onClick={() => router.push(courseUrl)}
                      sx={{
                        color: "var(--primary-color)",
                        textTransform: "none",
                        fontSize: "14px",
                      }}
                    >
                      View
                    </Button>
                  }
                  actionMobile={
                    <Button
                      variant="contained"
                      endIcon={<East />}
                      onClick={() => router.push(courseUrl)}
                      sx={{
                        textTransform: "none",
                        color: "var(--primary-color)",
                        backgroundColor: "var(--primary-color-acc-2)",
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
            <NoDataFound info="No Courses are enrolled" />
          )
        ) : (
          <CourseCardSkeleton />
        )}
      </Stack>
    </Box>
  );
}
