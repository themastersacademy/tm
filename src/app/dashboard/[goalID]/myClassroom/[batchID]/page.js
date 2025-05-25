"use client";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import Courses from "./Components/Courses";
import Exams from "./Components/Exams";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomTabs from "@/src/Components/CustomTabs/CustomTabs";
import DeleteDialogBox from "@/src/Components/DeleteDialogBox/DeleteDialogBox";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";

export default function Classroom() {
  const params = useParams();
  const router = useRouter();
  const [batchData, setBatchData] = useState(null);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false);
  const tabs = [
    {
      label: "Exams",
      content: (
        <Exams
          scheduledExams={scheduledExams}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          examID={params.batchID}
        />
      ),
    },
    { label: "Courses", content: <Courses /> },
  ];

  const leaveGroupOpen = () => {
    setIsLeaveGroupDialogOpen(true);
  };

  const leaveGroupClose = () => {
    setIsLeaveGroupDialogOpen(false);
  };

  const fetchBatch = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${params.batchID}`
    );
    const data = await response.json();
    if (data.success) {
      setBatchData(data.data);
    }
  };

  const fetchScheduledExams = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${params.batchID}/get-schedule-exam`
    );
    const data = await response.json();
    if (data.success) {
      console.log(data.data);
      setScheduledExams(data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
    fetchScheduledExams();
  }, []);

  return (
    <Stack
      padding="20px"
      gap="20px"
      minHeight="100vh"
      sx={{ padding: { xs: "10px", md: "20px" }, marginBottom: "60px" }}
      width="100%"
      maxWidth="1200px"
      margin="0 auto"
    >
      {isLoading ? (
        <PageSkeleton />
      ) : (
        <Stack
          flexDirection="row"
          alignItems="center"
          gap="15px"
          sx={{
            backgroundColor: "var(--white)",
            borderRadius: "10px",
            height: "60px",
            border: "1px solid var(--border-color)",
            padding: "10px",
          }}
          width="100%"
          maxWidth="1200px"
        >
          <ArrowBackIosNewRounded
            fontSize="small"
            onClick={() => router.back()}
            sx={{ cursor: "pointer" }}
          />
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "14px", md: "18px" },
              fontWeight: "700",
            }}
          >
            {batchData ? (
              `${batchData?.batchMeta?.title} (${batchData?.batchMeta?.instituteMeta?.title})`
            ) : (
              <Skeleton variant="text" width="150px" height="40px" />
            )}
          </Typography>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "var(--delete-color)",
              color: "var(--white)",
              marginLeft: "auto",
              fontSize: { xs: "10px", md: "14px" },
              minWidth: { xs: "94px", md: "110px" },
            }}
            disableElevation
            onClick={leaveGroupOpen}
          >
            Leave Group
          </Button>
        </Stack>
      )}
      <Stack>
        <CustomTabs tabs={tabs} />
      </Stack>
      <LeaveGroupDialog
        open={isLeaveGroupDialogOpen}
        onClose={leaveGroupClose}
      />
    </Stack>
  );
}

const LeaveGroupDialog = ({ open, onClose }) => {
  return (
    <DeleteDialogBox
      isOpen={open}
      title="Leave Group"
      actionButton={
        <Stack direction="row" spacing={2} justifyContent="center" width="100%">
          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--delete-color)" }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            sx={{ color: "var(--text2)", borderColor: "var(--text2)" }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Stack>
      }
    />
  );
};
