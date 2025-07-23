"use client";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { Stack, Button, Typography, Skeleton } from "@mui/material";
import troffy from "@/public/icons/troffy.svg";
import { ArrowBackIos, East, Lock } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useSession } from "next-auth/react";

export default function GroupID() {
  const { data: session } = useSession();
  const isPro = session?.user?.accountType === "PRO";
  const router = useRouter();
  const { groupID } = useParams();
  const params = useParams();
  const goalID = params.goalID;
  const [groupExam, setGroupExam] = useState([]);
  const [groupExamData, setGroupExamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupExam = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/type/${groupID}/group/all-exams`
    );
    const data = await response.json();
    if (data.success) {
      setGroupExam(data.data);
      console.log(data.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupExam();
  }, []);

  const fetchGroupExamData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/type/${goalID}/group/get-group`,
      {
        method: "POST",
        body: JSON.stringify({
          groupID: groupID,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setGroupExamData(data.data);
    }
    setLoading(false);
  }, [groupID, goalID]);

  useEffect(() => {
    fetchGroupExamData();
  }, [fetchGroupExamData, goalID]);

  return (
    <Stack
      padding="20px"
      gap="20px"
      width="100%"
      maxWidth="1200px"
      margin="0 auto"
    >
      <Stack
        flexDirection="row"
        alignItems="center"
        gap="4px"
        sx={{
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--white)",
          padding: "20px",
          borderRadius: "10px",
          height: "60px",
        }}
      >
        <ArrowBackIos
          onClick={() => router.back()}
          sx={{ cursor: "pointer", fontSize: "20px", fontWeight: "700" }}
        />
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
        >
          {groupExamData?.title || <Skeleton variant="text" width="100px" />}
        </Typography>
      </Stack>

      <Stack
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        flexWrap="wrap"
        gap="20px"
        width="100%"
        minHeight="80vh"
        bgcolor="white"
        borderRadius="10px"
        padding="20px"
        border="1px solid var(--border-color)"
      >
        {!loading ? (
          groupExam.length > 0 ? (
            groupExam.map((group, index) => (
              <PrimaryCard
                key={index}
                title={group.title}
                icon={troffy.src}
                actionButton={
                  <Button
                    variant="text"
                    endIcon={
                      isPro && group.settings.isProTest ? <East /> : <Lock />
                    }
                    onClick={() => router.push(`/exam/${group.id}`)}
                    sx={{
                      textTransform: "none",
                      color: "var(--primary-color)",
                      fontFamily: "Lato",
                      fontSize: "12px",
                    }}
                  >
                    {isPro && group.settings.isProTest
                      ? "Take Test"
                      : "PRO only"}
                  </Button>
                }
              />
            ))
          ) : (
            <Stack
              width="100%"
              minHeight="60vh"
              alignItems="center"
              justifyContent="center"
            >
              <NoDataFound info="No Group Exams found" />
            </Stack>
          )
        ) : (
          <PrimaryCardSkeleton />
        )}
      </Stack>
    </Stack>
  );
}
