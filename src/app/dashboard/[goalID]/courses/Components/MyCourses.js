"use client";
import { Button, Stack, Select } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { East, ShoppingBagRounded } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useCourses } from "@/src/app/context/CourseProvider";

export default function MyCourses() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [courseList, setCourseList] = useState([]);
  const { goalID } = params;
  const { enrolledCourses, loading } = useCourses();

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      sx={{ columnGap: { xs: "4px", md: "20px" }, rowGap: "10px" }}
    >
      {!loading ? (
        enrolledCourses.length > 0 ? (
          enrolledCourses.map((item, index) => (
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
              actionMobile={
                <Button
                  variant="contained"
                  endIcon={<ShoppingBagRounded />}
                  sx={{
                    textTransform: "none",
                    color: "var(--white)",
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "0px 0px 10px 10px",
                  }}
                  onClick={() => {
                    router.push(`/dashboard/${goalID}/courses/${item.id}`);
                  }}
                >
                  Purchase
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
