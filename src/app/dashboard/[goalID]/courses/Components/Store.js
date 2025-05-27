"use client";
import { Button, Stack, useTheme } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { ShoppingBagRounded } from "@mui/icons-material";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useRouter, useParams } from "next/navigation";
import { useCourses } from "@/src/app/context/CourseProvider";

export default function Store() {
  const params = useParams();
  const goalID = params.goalID;
  const router = useRouter();
  const { storeCourses, loading } = useCourses();
  const isMobile = useTheme().breakpoints.down("xs");

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      justifyContent={{ xs: "center", sm: "flex-start", md: "flex-start" }}
      alignItems={{ xs: "center", sm: "flex-start", md: "flex-start" }}
      sx={{ columnGap: { xs: "4px", md: "15px" }, rowGap: "10px" }}
      gap={{ xs: "10px", sm: "15px", md: "15px" }}
    >
      {!loading ? (
        storeCourses.length > 0 ? (
          storeCourses.map((item, index) => (
            <CourseCard
              key={index}
              title={item.title}
              thumbnail={item.thumbnail}
              Language={item.language}
              lessons={`${item.lessons} Lessons`}
              hours={`${item.duration} hours`}
              actionButton={
                <Button
                  variant="text"
                  endIcon={
                    <ShoppingBagRounded
                      sx={{ width: "16px", height: "16px" }}
                    />
                  }
                  onClick={() => {
                    router.push(`/dashboard/${goalID}/courses/${item.id}`);
                  }}
                  sx={{
                    textTransform: "none",
                    fontSize: "14px",
                    color: "var(--primary-color)",
                  }}
                >
                  Purchase
                </Button>
              }
              actionMobile={
                <Button
                  variant="contained"
                  endIcon={<ShoppingBagRounded />}
                  sx={{
                    textTransform: "none",
                    color: "var(--primary-color)",
                    backgroundColor: "var(--primary-color-acc-2)",
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
          <Stack
            width="100%"
            minHeight={"70vh"}
            justifyContent="center"
            alignItems={"center"}
          >
            <NoDataFound info="No courses found for this goal" />
          </Stack>
        )
      ) : (
        <Stack
          flexDirection="row"
          flexWrap="wrap"
          sx={{ columnGap: { xs: "4px", md: "15px" }, rowGap: "10px" }}
        >
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </Stack>
      )}
    </Stack>
  );
}
