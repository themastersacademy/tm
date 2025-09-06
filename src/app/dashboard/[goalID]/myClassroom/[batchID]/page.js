"use client";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import Courses from "./Components/Courses";
import Exams from "./Components/Exams";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import CustomTabs from "@/src/Components/CustomTabs/CustomTabs";
import DeleteDialogBox from "@/src/Components/DeleteDialogBox/DeleteDialogBox";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";

export default function Classroom() {
  const { batchID } = useParams();
  const router = useRouter();

  const [batchData, setBatchData] = useState(null);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false);

  // Handlers memoized
  const leaveGroupOpen = useCallback(() => {
    setIsLeaveGroupDialogOpen(true);
  }, []);

  const leaveGroupClose = useCallback(() => {
    setIsLeaveGroupDialogOpen(false);
  }, []);

  // Combined fetch for batch data and scheduled exams
  const fetchData = useCallback(async () => {
    if (!batchID) return;
    // setIsLoading(true);
    try {
      const [batchRes, examsRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${batchID}`
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/${batchID}/get-schedule-exam`
        ),
      ]);

      const batchJson = await batchRes.json();
      if (batchJson.success) {
        setBatchData(batchJson.data);
      } else {
        setBatchData(null);
      }

      const examsJson = await examsRes.json();
      if (examsJson.success) {
        setScheduledExams(examsJson.data);
        setIsLoading(false);
      } else {
        setScheduledExams([]);
        setIsLoading(false);
      }
    } catch (err) {
      // Optionally handle fetch errors, e.g., show a snackbar
      setBatchData(null);
      setScheduledExams([]);
      setIsLoading(false);
    }
  }, [batchID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize tabs so they aren't recreated each render
  const tabs = useMemo(
    () => [
      {
        label: "Exams",
        content: <Exams scheduledExams={scheduledExams} batchID={batchID} examID={batchID} />,
      },
      // {
      //   label: "Courses",
      //   content: <Courses />,
      // },
    ],
    [scheduledExams, batchID]
  );

  return isLoading ? (
    <PageSkeleton />
  ) : (
    <Stack
      padding="20px"
      gap="20px"
      minHeight="100vh"
      sx={{ padding: { xs: "10px", md: "20px" }, marginBottom: "60px" }}
      width="100%"
      maxWidth="1200px"
      margin="0 auto"
    >
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
            `${batchData.batchMeta?.title} (${batchData.batchMeta?.instituteMeta?.title})`
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
          Leave room
        </Button>
      </Stack>

      <Stack>
        {/* <CustomTabs tabs={tabs} customstyles={ {tabs: {width: "106px !important"}}} /> */}
        {tabs[0].content}
      </Stack>

      <LeaveGroupDialog
        open={isLeaveGroupDialogOpen}
        onClose={leaveGroupClose}
      />
    </Stack>
  );
}

const LeaveGroupDialog = ({ open, onClose }) => {
  // Memoize action buttons maybe, but simple enough
  return (
    <DeleteDialogBox
      isOpen={open}
      title="Leave Group"
      actionButton={
        <Stack direction="row" spacing={2} justifyContent="center" width="100%">
          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--delete-color)" }}
            // You may add onClick handler here to actually perform leave action
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
