"use client";
import DialogBox from "@/src/Components/DialogBox/DialogBox";
import SecondaryCard from "@/src/Components/SecondaryCard/SecondaryCard";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Close, East } from "@mui/icons-material";
import {
  Button,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import group from "@/public/icons/group.svg";
import Image from "next/image";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import { useSnackbar } from "notistack";
import LinearProgressLoading from "@/src/Components/LinearProgressLoading/LinearProgressLoading";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import { useClassrooms } from "@/src/app/context/ClassroomProvider";

export default function MyClassroom() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogOpen = () => setIsDialogOpen(true);
  const dialogClose = () => setIsDialogOpen(false);
  const [localLoading, setLocalLoading] = useState(false);
  const params = useParams();
  const goalID = params.goalID;
  const { classrooms, loading, refetchClassrooms } = useClassrooms();

  return (
    <Stack>
      {localLoading && <LinearProgressLoading />}
      {loading ? (
        <PageSkeleton />
      ) : (
        <Stack
          padding={{ xs: "10px", md: "20px" }}
          gap={{ xs: "10px", md: "35px" }}
          alignItems="center"
          sx={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            marginBottom: { xs: "60px", md: "0px" },
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            sx={{
              backgroundColor: "var(--white)",
              borderRadius: "10px",
              height: "60px",
              border: { xs: "none", md: "1px solid var(--border-color)" },
              padding: { xs: "px", md: "10px 20px" },
            }}
            width="100%"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "18px",
                fontWeight: "700",
              }}
            >
              My Classroom
            </Typography>
            <Button
              variant="contained"
              onClick={dialogOpen}
              sx={{
                textTransform: "none",
                backgroundColor: "var(--primary-color)",
              }}
              disableElevation
            >
              Join Batch
            </Button>
          </Stack>
          <Stack width="100%" gap="15px">
            {!loading ? (
              classrooms.length > 0 ? (
                classrooms.map((item, index) => (
                  <SecondaryCard
                    key={index}
                    title={
                      <span
                        onClick={() => {
                          router.push(
                            `/dashboard/${goalID}/myClassroom/${item.batchID}`
                          );
                        }}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                          WebkitTapHighlightColor: "transparent",
                        }}
                      >
                        {`${item.batchMeta.title} (${item.batchMeta.instituteMeta.title})`}
                      </span>
                    }
                    icon={<Image src={group} alt="" />}
                    button={item.button}
                    cardWidth="100%"
                  />
                ))
              ) : (
                <NoDataFound info="No classroom's are enrolled" />
              )
            ) : (
              <>
                <SecondaryCardSkeleton fullWidth />
                <SecondaryCardSkeleton fullWidth />
              </>
            )}
          </Stack>
          <JoinClassroomDialog
            isDialogOpen={isDialogOpen}
            dialogClose={dialogClose}
            classrooms={classrooms}
            refetchClassrooms={refetchClassrooms}
            localLoading={localLoading}
            setLocalLoading={setLocalLoading}
          />
        </Stack>
      )}
    </Stack>
  );
}

const JoinClassroomDialog = ({
  isDialogOpen,
  dialogClose,
  refetchClassrooms,
  localLoading,
  setLocalLoading,
}) => {
  const [batchCode, setBatchCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const joinClassroom = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/my-classroom/batch-enroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchCode: batchCode,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      refetchClassrooms();
      setBatchCode("");
      dialogClose();
      setLocalLoading(false);
    } else {
      setLocalLoading(false);
      enqueueSnackbar(data.message, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <DialogBox
      isOpen={isDialogOpen}
      title="Join Classroom"
      icon={
        <IconButton
          onClick={dialogClose}
          sx={{ marginLeft: "auto", padding: "3px", borderRadius: "5px" }}
        >
          <Close sx={{ color: "var(--text3)" }} />
        </IconButton>
      }
      actionButton={
        <Button
          variant="text"
          endIcon={<East />}
          onClick={() => {
            setLocalLoading(true);
            joinClassroom();
          }}
          disabled={batchCode === "" || localLoading}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            fontSize: "12px",
            color: "var(--primary-color)",
          }}
        >
          Join batch
        </Button>
      }
    >
      <DialogContent sx={{ padding: { xs: "10px", md: "10px 20px" } }}>
        <Stack>
          <StyledTextField
            placeholder="Enter batch code"
            value={batchCode}
            onChange={(e) => setBatchCode(e.target.value)}
          />
        </Stack>
      </DialogContent>
    </DialogBox>
  );
};
