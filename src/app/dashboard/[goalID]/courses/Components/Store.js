"use client";
import { Button, Stack } from "@mui/material";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import CourseCard from "@/src/Components/CourseCard/CourseCard";
import { ShoppingBagRounded } from "@mui/icons-material";
import { useEffect, useState } from "react";
import CourseCardSkeleton from "@/src/Components/SkeletonCards/CourseCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useRouter, useParams } from "next/navigation";

export default function Store() {
  const [isLoading, setIsLoading] = useState(true);
  const [storeList, setStoreList] = useState([]);
  const params = useParams();
  const goalID = params.goalID;
  const router = useRouter();

  const fetchStoreList = async (goalId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/home/goal-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goalID: goalId }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setStoreList(data.data.coursesList || []);
      } else {
        console.error("Failed to fetch courses:", data.message);
        setStoreList([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setStoreList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (goalID) {
      fetchStoreList(goalID);
    } else {
      console.warn("No goalID found, skipping fetch.");
      setIsLoading(false); // Stop loading if no goalId
      setStoreList([]); // Reset storeList to show NoDataFound
    }
  }, [goalID]);

  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      sx={{ columnGap: { xs: "4px", md: "15px" }, rowGap: "10px" }}
    >
      {!isLoading ? (
        storeList.length > 0 ? (
          storeList.map((item, index) => (
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
                    color: "var(--primary-color)",
                    fontSize: "12px",
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