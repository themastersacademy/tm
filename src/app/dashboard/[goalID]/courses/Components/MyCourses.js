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

    // const hasCourses =
    // Array.isArray(enrolledCourses) && enrolledCourses.length > 0;
  return (
    <Box px={{ xs: 0, sm: 0 }} py={0} width="100%">
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent={{ xs: "center", sm: "flex-start" }}
        alignItems="flex-start"
        sx={{ columnGap: { xs: "4px", md: "20px" }, rowGap: "10px" }}
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
                      endIcon={<East sx={{ width: 16, height: 16 }}/>}
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
    </Box>
  );
}
