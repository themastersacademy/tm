"use client";
import { Button, Stack } from "@mui/material";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { ShoppingBagRounded } from "@mui/icons-material";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useRouter, useParams } from "next/navigation";
import { useCourses } from "@/src/app/context/CourseProvider";

export default function Store() {
  const { goalID } = useParams();
  const router = useRouter();
  const { storeCourses, loading } = useCourses();

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      justifyContent={{ xs: "center", sm: "flex-start" }}
      alignItems="flex-start"
      sx={{ columnGap: { xs: "4px", md: "20px" }, rowGap: "10px" }}
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
                    <ShoppingBagRounded sx={{ width: 16, height: 16 }} />
                  }
                  onClick={() =>
                    router.push(`/dashboard/${goalID}/courses/${item.id}`)
                  }
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
                  Purchase
                </Button>
              }
            />
          ))
        ) : (
          <Stack
            width="100%"
            minHeight="70vh"
            justifyContent="center"
            alignItems="center"
          >
            <NoDataFound info="No courses found for this goal" />
          </Stack>
        )
      ) : (
        <Stack flexWrap="wrap" direction="row" columnGap="10px" rowGap="10px">
          {[...Array(2)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
