"use client";
import {
  Button,
  IconButton,
  Stack,
  Typography,
  DialogContent,
  Popover,
  InputBase,
  Badge,
  Avatar,
} from "@mui/material";
import {
  ArrowBackIosRounded,
  Notifications,
  Add,
  Close,
  East,
  Search,
  KeyboardArrowDown,
  ExpandMore,
} from "@mui/icons-material";
import Image from "next/image";
import mCoins from "@/public/icons/mCoins.svg";
import PlansDialogBox from "../PlansDialogBox/PlansDialogBox";
import { useState } from "react";
import { useSession } from "next-auth/react";
import DialogBox from "../DialogBox/DialogBox";
import gate_cse from "@/public/icons/gate_cse.svg";
import placement from "@/public/icons/placements.svg";
import Banking from "@/public/icons/banking.svg";
import { useSnackbar } from "notistack";
import { useParams, usePathname, useRouter } from "next/navigation";
import HeaderSkeleton from "../SkeletonCards/HeaderSkeleton";
import { useGoals } from "@/src/app/context/GoalProvider";
import GoalCard from "../GoalCard/GoalCard";

export default function Header({ button = [], back }) {
  const params = useParams();
  const selectedGoalID = params.goalID;
  const pathname = usePathname();
  const router = useRouter();
  const { goals, enrolledGoals, loading, refetchGoals } = useGoals();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data: session } = useSession();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState({
    goalID: selectedGoalID,
    icon: "",
    title: "",
  });

  // Goal Selector Popover State
  const [anchorEl, setAnchorEl] = useState(null);
  const openGoalSelector = Boolean(anchorEl);

  const handleGoalClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGoalClose = () => {
    setAnchorEl(null);
  };

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  const handleGoalChange = (newGoalId) => {
    const newPath = pathname.replace(selectedGoalID, newGoalId);
    newGoalId && router.push(newPath);
    document.cookie = `selectedGoalID=${newGoalId}; path=/; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30
    ).toUTCString()}`;
    handleGoalClose();
  };

  const dialogOpen = () => {
    setGoalDialogOpen(true);
    handleGoalClose();
  };
  const dialogClose = () => {
    setGoalDialogOpen(false);
  };

  // Function to handle goal enrollment
  const handleEnrollGoal = async () => {
    const { goalID, icon, title } = selectedGoal;

    if (!goalID) {
      return enqueueSnackbar("Please select a goal to enroll.", {
        variant: "warning",
      });
    }

    const url = "/api/goal-enrollment/enroll";
    const payload = { goalID, icon, title };
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);

      // Handle non-2xx status
      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`);
      }

      const { success, message } = await response.json();

      if (!success) {
        return enqueueSnackbar(message || "Enrollment failed.", {
          variant: "error",
        });
      }

      refetchGoals(); // refresh data
      setGoalDialogOpen(false); // close dialog
      enqueueSnackbar("Successfully enrolled!", {
        variant: "success",
      });

      const newPath = pathname.replace(selectedGoalID, goalID);
      router.push(newPath);
      document.cookie = `selectedGoalID=${goalID}; path=/; expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30
      ).toUTCString()}`;
    } catch (err) {
      console.error("Error enrolling goal:", err);
      enqueueSnackbar(
        err.message.includes("Server responded")
          ? "Enrollment service error."
          : "An unexpected error occurred.",
        { variant: "error" }
      );
    }
  };

  const currentGoal = goals.find((g) => g.id === selectedGoalID);

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
            backgroundColor: "var(--white)",
            padding: "0 24px",
            borderRadius: { xs: "0px", md: "10px" },
            height: "70px",
            gap: "20px",
          }}
        >
          {/* Left Section: Back Button & Goal Selector */}
          <Stack flexDirection="row" alignItems="center" gap="15px">
            {back && (
              <IconButton
                onClick={() => window.history.back()}
                sx={{
                  color: "var(--text1)",
                  "&:hover": { backgroundColor: "var(--sec-color-acc-2)" },
                }}
              >
                <ArrowBackIosRounded sx={{ fontSize: "20px" }} />
              </IconButton>
            )}

            <Stack
              onClick={handleGoalClick}
              direction="row"
              alignItems="center"
              gap="12px"
              sx={{
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "12px",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--sec-color-acc-2)",
                },
              }}
            >
              <Stack
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--primary-color-acc-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={
                    currentGoal?.icon === "castle"
                      ? gate_cse
                      : currentGoal?.icon === "org"
                      ? placement
                      : currentGoal?.icon === "institute"
                      ? Banking
                      : gate_cse
                  }
                  alt="Goal Icon"
                  width={24}
                  height={24}
                />
              </Stack>
              <Stack>
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    fontWeight: 500,
                  }}
                >
                  Selected Goal
                </Typography>
                <Stack direction="row" alignItems="center" gap="4px">
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    {currentGoal?.title || "Select Goal"}
                  </Typography>
                  <ExpandMore
                    sx={{
                      fontSize: "18px",
                      color: "var(--text3)",
                      transform: openGoalSelector
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* Goal Selector Popover */}
            <Popover
              open={openGoalSelector}
              anchorEl={anchorEl}
              onClose={handleGoalClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: "240px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid var(--border-color)",
                  padding: "8px",
                },
              }}
              disableScrollLock
            >
              <Stack gap="4px">
                {enrolledGoals.map((goalEnrolled) => {
                  const goal = goals.find((g) => g.id === goalEnrolled.goalID);
                  const isSelected = goal?.id === selectedGoalID;
                  return (
                    <Stack
                      key={goalEnrolled.goalID}
                      onClick={() => handleGoalChange(goalEnrolled.goalID)}
                      direction="row"
                      alignItems="center"
                      gap="12px"
                      sx={{
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        backgroundColor: isSelected
                          ? "var(--primary-color-acc-2)"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "var(--primary-color-acc-2)"
                            : "var(--sec-color-acc-2)",
                        },
                      }}
                    >
                      <Image
                        src={
                          goal?.icon === "castle"
                            ? gate_cse
                            : goal?.icon === "org"
                            ? placement
                            : goal?.icon === "institute"
                            ? Banking
                            : gate_cse
                        }
                        alt={goal?.title}
                        width={20}
                        height={20}
                      />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected
                            ? "var(--primary-color)"
                            : "var(--text1)",
                        }}
                      >
                        {goal?.title}
                      </Typography>
                    </Stack>
                  );
                })}
                <Button
                  startIcon={<Add />}
                  onClick={dialogOpen}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    color: "var(--primary-color)",
                    justifyContent: "flex-start",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "var(--primary-color-acc-2)",
                    },
                  }}
                >
                  Add New Goal
                </Button>
              </Stack>
            </Popover>
          </Stack>
          {/* Center Section: Search Bar - HIDDEN */}
          {/* <Stack
            sx={{
              flex: 1,
              maxWidth: "400px",
              display: { xs: "none", md: "flex" },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                backgroundColor: "var(--sec-color-acc-2)",
                borderRadius: "12px",
                padding: "8px 16px",
                border: "1px solid transparent",
                transition: "all 0.2s",
                "&:focus-within": {
                  backgroundColor: "var(--white)",
                  borderColor: "var(--primary-color)",
                  boxShadow: "0 0 0 3px var(--primary-color-acc-2)",
                },
              }}
            >
              <Search sx={{ color: "var(--text3)", mr: 1 }} />
              <InputBase
                placeholder="Search for courses, exams..."
                sx={{
                  width: "100%",
                  fontSize: "14px",
                  color: "var(--text1)",
                  "& input::placeholder": {
                    color: "var(--text3)",
                    opacity: 1,
                  },
                }}
              />
            </Stack>
          </Stack> */}
          {/* Right Section: Actions */}
          <Stack flexDirection="row" alignItems="center" gap="20px">
            {/* Additional Buttons */}
            {button.length > 0 && (
              <Stack flexDirection="row" gap="10px">
                {button.map((btn, index) => (
                  <Stack key={index}>{btn}</Stack>
                ))}
              </Stack>
            )}

            {/* Gamification & Notifications - HIDDEN */}
            {/* <Stack
              direction="row"
              alignItems="center"
              gap="16px"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="6px"
                sx={{
                  backgroundColor: "var(--sec-color-acc-1)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "1px solid var(--sec-color-acc-2)",
                }}
              >
                <Image src={mCoins} alt="Coins" width={20} height={20} />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--sec-color)",
                  }}
                >
                  100
                </Typography>
              </Stack>

              <IconButton
                sx={{
                  color: "var(--text2)",
                  "&:hover": { color: "var(--primary-color)" },
                }}
              >
                <Badge color="error" variant="dot">
                  <Notifications />
                </Badge>
              </IconButton>
            </Stack> */}

            {/* Plan Status */}
            <Button
              onClick={handlePlansDialogOpen}
              variant={
                session?.user?.accountType === "PRO" ? "contained" : "outlined"
              }
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                padding: "6px 16px",
                height: "36px",
                fontSize: "13px",
                fontWeight: 700,
                boxShadow: "none",
                backgroundColor:
                  session?.user?.accountType === "PRO"
                    ? "var(--primary-color)"
                    : "transparent",
                borderColor:
                  session?.user?.accountType === "PRO"
                    ? "transparent"
                    : "var(--primary-color)",
                color:
                  session?.user?.accountType === "PRO"
                    ? "var(--white)"
                    : "var(--primary-color)",
                "&:hover": {
                  backgroundColor:
                    session?.user?.accountType === "PRO"
                      ? "var(--primary-color-dark)"
                      : "var(--primary-color-acc-2)",
                  borderColor:
                    session?.user?.accountType === "PRO"
                      ? "transparent"
                      : "var(--primary-color)",
                  boxShadow: "none",
                },
              }}
            >
              {session?.user?.accountType === "PRO" ? "PRO Plan" : "Upgrade"}
            </Button>

            <PlansDialogBox
              plansDialogOpen={plansDialogOpen}
              handlePlansDialogClose={handlePlansDialogClose}
            />
          </Stack>

          {/* Goal Enrollment Dialog */}
          <DialogBox
            isOpen={goalDialogOpen}
            title="Select a Goal"
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
                variant="contained"
                endIcon={<East />}
                sx={{
                  textTransform: "none",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  borderRadius: "8px",
                  padding: "8px 24px",
                  "&:hover": {
                    backgroundColor: "var(--primary-color-dark)",
                  },
                }}
                onClick={handleEnrollGoal}
              >
                Enroll Now
              </Button>
            }
            sx={{
              "& .MuiDialog-paper": {
                width: "1200px",
                maxWidth: { xs: "95%", md: "1200px" },
                borderRadius: "20px",
                boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
              },
            }}
          >
            <DialogContent
              sx={{
                padding: "32px",
                background:
                  "linear-gradient(to bottom, #FAFBFC 0%, #FFFFFF 100%)",
              }}
            >
              <Stack gap="12px" mb="32px" alignItems="center">
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "var(--text2)",
                    textAlign: "center",
                    lineHeight: 1.6,
                    maxWidth: "600px",
                  }}
                >
                  Choose a goal to start your learning journey. You can switch
                  between goals anytime from your dashboard.
                </Typography>
              </Stack>
              <Stack
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  md: "repeat(2, 1fr)",
                }}
                gap="20px"
              >
                {goals.map((goalItem) => {
                  const isEnrolled = enrolledGoals.some(
                    (eg) => eg.goalID === goalItem.id
                  );
                  return (
                    <GoalCard
                      key={goalItem.id}
                      title={goalItem.title}
                      icon={goalItem.icon}
                      tagline={goalItem.tagline}
                      description={goalItem.description}
                      coursesCount={goalItem.coursesCount}
                      subjectsCount={goalItem.subjectsCount}
                      blogsCount={goalItem.blogsCount}
                      isSelected={selectedGoal.goalID === goalItem.id}
                      isEnrolled={isEnrolled}
                      onClick={() =>
                        setSelectedGoal({
                          goalID: goalItem.id,
                          icon: goalItem.icon,
                          title: goalItem.title,
                        })
                      }
                    />
                  );
                })}
              </Stack>
            </DialogContent>
          </DialogBox>
        </Stack>
      )}
    </>
  );
}
