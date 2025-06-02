"use client";
import { Button, Stack } from "@mui/material";
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

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      justifyContent={{ xs: "center", sm: "flex-start" }}
      alignItems="flex-start"
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
                  onClick={() =>
                    router.push(`/dashboard/${goalID}/courses/${item.id}`)
                  }
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
                  onClick={() =>
                    router.push(`/dashboard/${goalID}/courses/${item.id}`)
                  }
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
