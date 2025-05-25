"use client";
import {
  Button,
  IconButton,
  Stack,
  Typography,
  Select,
  DialogContent,
  MenuItem,
} from "@mui/material";
import {
  ArrowBackIosRounded,
  Notifications,
  Add,
  Close,
  East,
} from "@mui/icons-material";
import Image from "next/image";
import mCoins from "@/public/icons/mCoins.svg";
import PlansDialogBox from "../PlansDialogBox/PlansDialogBox";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DialogBox from "../DialogBox/DialogBox";
import gate_cse from "@/public/icons/gate_cse.svg";
import placement from "@/public/icons/placements.svg";
import Banking from "@/public/icons/banking.svg";
import { useSnackbar } from "notistack";
import { useParams, usePathname, useRouter } from "next/navigation";
import HeaderSkeleton from "../SkeletonCards/HeaderSkeleton";
import { useGoals } from "@/src/app/context/GoalProvider";

export default function Header({ button = [], back }) {
  const params = useParams();
  const goalID = params.goalID;
  const pathname = usePathname();
  const router = useRouter();
  const { goals, enrolledGoals, loading } = useGoals();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data: session } = useSession();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState({
    goalID: goalID,
    icon: "",
    title: "",
  });

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };
  const handleSelectChange = (event) => {
    const newGoalId = event.target.value;
    const newPath = pathname.replace(goalID, newGoalId);
    console.log(newPath);
    newGoalId && router.push(newPath);
  };
  const dialogOpen = () => {
    setGoalDialogOpen(true);
  };
  const dialogClose = () => {
    setGoalDialogOpen(false);
  };

  // Function to handle goal enrollment
  const handleEnrollGoal = async () => {
    if (!selectedGoal.goalID) {
      enqueueSnackbar("Please select a goal to enroll.", {
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/goal-enrollment/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalID: selectedGoal.goalID,
          icon: selectedGoal.icon,
          title: selectedGoal.title,
        }),
      });

      const result = await response.json();
      if (result.success) {
        fetchGoals();
        setGoalDialogOpen(false);
        enqueueSnackbar("Successfully enrolled in the goal!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message || "Failed to enroll in the goal.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error enrolling goal:", error);
      enqueueSnackbar("An error occurred while enrolling in the goal.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <Stack
          sx={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--white)",
            padding: "0px 25px",
            borderRadius: { xs: "0px", md: "10px" },
            height: "60px",
          }}
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            gap="15px"
            width="100%"
          >
            {back && (
              <ArrowBackIosRounded
                onClick={() => {
                  window.history.back();
                }}
                sx={{
                  fontSize: "20px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              />
            )}
            <Select
              value={goalID}
              onChange={handleSelectChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return "Loading...";
                }
                const goal = goals.find((option) => option.id === goalID);
                return goal ? goal.title : "Loading";
              }}
              variant="outlined"
              MenuProps={{
                disableScrollLock: true,
                PaperProps: {
                  sx: {
                    padding: "8px",
                    "& .MuiList-root": {
                      paddingBottom: 0,
                      borderColor: "var(--border-color)",
                    },
                  },
                },
              }}
              sx={{
                minWidth: "170px",
                height: "40px",
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: goalID ? "var(--sec-color)" : "inherit",
                },
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--sec-color)",
                  },
                },
              }}
            >
              {enrolledGoals.map((goalEnrolled) => (
                <MenuItem key={goalEnrolled.goalID} value={goalEnrolled.goalID}>
                  {goals.find((goal) => goal.id === goalEnrolled.goalID)?.title}
                </MenuItem>
              ))}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={dialogOpen}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  textTransform: "none",
                  marginTop: "8px",
                  width: "100%",
                  justifyContent: "flex-start",
                }}
              >
                Add Goals
              </Button>
            </Select>
          </Stack>
          <Stack flexDirection="row" gap="15px" alignItems="center">
            <Stack flexDirection="row" gap="10px" alignItems="center">
              {button.map((buttons, index) => (
                <Stack key={index}>{buttons}</Stack>
              ))}
            </Stack>
            <Stack
              flexDirection="row"
              alignItems="center"
              sx={{
                marginLeft: "auto",
                gap: "8px",
              }}
            >
              <Stack
                flexDirection="row"
                alignItems="center"
                gap="8px"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <IconButton sx={{ padding: "0px" }}>
                  <Notifications sx={{ color: "var(--primary-color)" }} />
                </IconButton>
                <Image src={mCoins} alt="mCoins" />
                <Typography>100</Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={handlePlansDialogOpen}
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  backgroundColor:
                    session?.user?.accountType === "PRO"
                      ? "var( --delete-color-acc-1)"
                      : "var(--primary-color)",
                  color:
                    session?.user?.accountType === "PRO"
                      ? "red"
                      : "var(--primary-color)",
                  fontFamily: "Lato",
                  fontWeight: "700",
                  height: "30px",
                }}
                disableElevation
              >
                {session?.user?.accountType}
              </Button>
            </Stack>
            <PlansDialogBox
              plansDialogOpen={plansDialogOpen}
              handlePlansDialogClose={handlePlansDialogClose}
            />
          </Stack>

          <DialogBox
            isOpen={goalDialogOpen}
            title="Select Goal"
            icon={
              <IconButton
                sx={{ marginLeft: "auto", padding: "4px", borderRadius: "8px" }}
                onClick={dialogClose}
              >
                <Close />
              </IconButton>
            }
            actionButton={
              <Button
                variant="text"
                endIcon={<East />}
                sx={{ textTransform: "none", color: "var(--primary-color)" }}
                onClick={handleEnrollGoal}
              >
                Enroll Goal
              </Button>
            }
          >
            <DialogContent>
              <Stack
                gap="25px"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
              >
                {goals.map((goalItem) => (
                  <Stack
                    key={goalItem.id}
                    gap="10px"
                    onClick={() =>
                      setSelectedGoal({
                        goalID: goalItem.id,
                        icon: goalItem.icon,
                        title: goalItem.title,
                      })
                    }
                    alignItems="center"
                  >
                    <Stack
                      sx={{
                        width: "62px",
                        height: "62px",
                        backgroundColor:
                          selectedGoal.goalID === goalItem.id
                            ? "var(--primary-color)"
                            : "var(--sec-color-acc-2)",
                        borderRadius: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        src={
                          goalItem.icon === "castle"
                            ? gate_cse
                            : goalItem.icon === "org"
                            ? placement
                            : goalItem.icon === "institute"
                            ? Banking
                            : gate_cse
                        }
                        alt={goalItem.title}
                        width={22}
                        height={25}
                      />
                    </Stack>
                    <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
                      {goalItem.title}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </DialogContent>
          </DialogBox>
        </Stack>
      )}
    </>
  );
}
