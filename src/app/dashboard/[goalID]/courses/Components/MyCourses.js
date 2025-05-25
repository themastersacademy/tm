"use client";
import { Button, Stack, Select } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { East } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";

export default function MyCourses() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [courseList, setCourseList] = useState([]);
  const { goalID } = params;
  console.log("MyCourses goalID", goalID);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    if (!goalID) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/get-enrolled-course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goalID }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setCourseList(data.data);
      } else {
        setCourseList([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [goalID]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, goalID]);

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      sx={{ columnGap: { xs: "4px", md: "20px" }, rowGap: "10px" }}
    >
      {!isLoading ? (
        courseList.length > 0 ? (
          courseList.map((item, index) => (
            <CourseCard
              key={index}
              title={item.title}
              thumbnail={item.thumbnail}
              lessons={`${item.lessons} Lessons`}
              hours={`${item.duration} minutes`}
              Language={item.language}
              actionButton={
                <Button
                  variant="text"
                  endIcon={<East />}
                  sx={{
                    color: "var(--primary-color)",
                    textTransform: "none",
                    fontSize: "14px",
                  }}
                  onClick={() => {
                    router.push(`/dashboard/${goalID}/courses/${item.id}`);
                  }}
                >
                  View
                </Button>
              }
            />
          ))
        ) : (
          <NoDataFound info="No Courses are enrolled" />
        )
      ) : (
        <CourseCardSkeleton />
      )}
    </Stack>
  );
}
