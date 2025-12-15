// ProfileSetupPage.js
"use client";
import Image from "next/image";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import {
  Button,
  Stack,
  Typography,
  Box,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { enqueueSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";
import GoalCard from "@/src/Components/GoalCard/GoalCard";
import { ArrowForward } from "@mui/icons-material";

export default function ProfileSetupPage({ isMobile }) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const theme = useTheme();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [selectedGoal, setSelectedGoal] = useState({
    goalID: "",
    icon: "",
    title: "",
  });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  // Check if goal query param is true (meaning profile step is done)
  const isGoalSelection = searchParams.get("goal") === "true";

  // Fetch goal list
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goal/all");
        const result = await response.json();
        if (result.success) {
          setGoals(result.data);
        }
      } catch (error) {
        console.error("Error fetching goals", error);
      }
    };
    fetchGoals();

    if (session?.user) {
      setName(session.user.name || "");
      setPhoneNumber(session.user.phoneNumber || "");
      setGender(session.user.gender || "");

      // If user has all profile details and is NOT explicitly on goal step via URL,
      // see if we should auto-skip to goal selection or dashboard
      if (
        session.user.name &&
        session.user.phoneNumber &&
        session.user.gender &&
        !isGoalSelection
      ) {
        setIsProfileUpdated(true);
      }
    }
  }, [session, isGoalSelection]);

  const handleSubmit = async () => {
    if (!name || !phoneNumber || !gender) return;

    setLoading(true);
    try {
      const response = await fetch("/api/user/profile-update", {
        method: "POST",
        body: JSON.stringify({ name, phoneNumber, gender }),
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Details saved properly! Let's choose your goal.", {
          variant: "success",
        });
        await update();
        setIsProfileUpdated(true);
        router.push("/profile-setup?goal=true");
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async () => {
    if (!selectedGoal.goalID) return;

    setLoading(true);
    try {
      const response = await fetch("/api/goal-enrollment/enroll", {
        method: "POST",
        body: JSON.stringify({
          goalID: selectedGoal.goalID,
          icon: selectedGoal.icon,
          title: selectedGoal.title,
        }),
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Goal setup complete! Welcome to your dashboard.", {
          variant: "success",
        });
        await update();
        router.push("/dashboard");
      } else {
        enqueueSnackbar(data.message || "Failed to set goal", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace("+91", "").replace(/[^0-9]/g, "");
    if (value.length <= 10) setPhoneNumber(value);
  };

  const renderGoalSelection = () => (
    <Stack gap="32px" width="100%" alignItems="center">
      <Stack gap="8px" alignItems="center" textAlign="center">
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "32px" },
            fontWeight: 800,
            color: "var(--text1)",
            letterSpacing: "-0.5px",
          }}
        >
          Choose your learning goal 🎯
        </Typography>
        <Typography sx={{ color: "var(--text3)", maxWidth: "500px" }}>
          Select the exam or domain you want to master. We&apos;ll personalize
          your learning experience based on this.
        </Typography>
      </Stack>

      {/* Goals Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(280px, 1fr))",
          },
          gap: "24px",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            icon={goal.icon}
            tagline="Official Course"
            description={
              goal.description ||
              "Complete preparation package including video lectures, mock tests, and study material."
            }
            isSelected={selectedGoal.goalID === goal.id}
            onClick={() =>
              setSelectedGoal({
                goalID: goal.id,
                icon: goal.icon,
                title: goal.title,
              })
            }
          />
        ))}
      </Box>

      {/* Action Bar */}
      <Stack
        width="100%"
        maxWidth="900px"
        direction="row"
        justifyContent="flex-end"
        pt={2}
      >
        <Button
          variant="contained"
          size="large"
          endIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ArrowForward />
            )
          }
          disabled={loading || !selectedGoal.goalID}
          onClick={handleGoalSubmit}
          sx={{
            minWidth: "200px",
            height: "56px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            boxShadow: "0 8px 16px rgba(246, 128, 5, 0.25)",
            "&:hover": {
              backgroundColor: "#E67300",
              boxShadow: "0 12px 20px rgba(246, 128, 5, 0.35)",
            },
          }}
        >
          {loading ? "Setting up..." : "Continue to Dashboard"}
        </Button>
      </Stack>
    </Stack>
  );

  const renderProfileForm = () => (
    <Stack gap="32px" width="100%" maxWidth="480px" alignItems="center">
      <Stack gap="8px" alignItems="center" textAlign="center">
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "32px" },
            fontWeight: 800,
            color: "var(--text1)",
            letterSpacing: "-0.5px",
          }}
        >
          Let&apos;s get to know you 👋
        </Typography>
        <Typography sx={{ color: "var(--text3)" }}>
          Please complete your profile to continue
        </Typography>
      </Stack>

      <Stack width="100%" gap="24px">
        <Stack gap="8px">
          <Typography sx={{ fontWeight: 600, color: "var(--text2)" }}>
            Full Name
          </Typography>
          <StyledTextField
            placeholder="John Doe"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Stack>

        <Stack gap="8px">
          <Typography sx={{ fontWeight: 600, color: "var(--text2)" }}>
            Phone Number
          </Typography>
          <StyledTextField
            placeholder="+91 99999 99999"
            fullWidth
            value={`+91 ${phoneNumber}`}
            onChange={handlePhoneNumberChange}
          />
        </Stack>

        <Stack gap="8px">
          <Typography sx={{ fontWeight: 600, color: "var(--text2)" }}>
            Gender
          </Typography>
          <StyledSelect
            options={["Male", "Female", "Other"]}
            title="Select Gender"
            value={gender || ""}
            onChange={(e) => setGender(e.target.value)}
            getLabel={(option) => option}
            getValue={(option) => option}
            sx={{ width: "100%" }}
          />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading || !name || !phoneNumber || !gender}
          onClick={handleSubmit}
          sx={{
            height: "56px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            mt: 2,
            boxShadow: "0 8px 16px rgba(246, 128, 5, 0.2)",
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save & Continue"
          )}
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      width={isMobile ? "100%" : "60%"} // Made slightly wider for better goal grid
      height="100vh" // Use full viewport height
      sx={{ overflowY: "auto" }} // Allow scroll if content is tall
    >
      <Box sx={{ p: { xs: 3, md: 6 }, minHeight: "100%" }}>
        <Stack
          minHeight="calc(100vh - 96px)" // Account for padding
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo Section */}
          <Stack alignItems="center" gap={2} sx={{ mb: 6 }}>
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                bgcolor: "#F5F5F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #EBEBEB",
              }}
            >
              <Image src={mastersLogo} alt="TMA" width={48} height={48} />
            </Box>
          </Stack>

          {/* Main Content */}
          <Suspense
            fallback={
              <CircularProgress sx={{ color: "var(--primary-color)" }} />
            }
          >
            <Fade in={true} timeout={500}>
              <Box width="100%" display="flex" justifyContent="center">
                {isGoalSelection ? renderGoalSelection() : renderProfileForm()}
              </Box>
            </Fade>
          </Suspense>

          {/* Footer */}
          <Stack
            width="100%"
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            pt={6}
            gap={2}
          >
            <Typography
              sx={{ color: "var(--text4)", fontSize: "12px", fontWeight: 600 }}
            >
              © 2025 The Masters Academy
            </Typography>

            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                suppressHydrationWarning
                sx={{
                  color: "var(--text4)",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                Designed by
              </Typography>
              <Image
                suppressHydrationWarning
                src={incrixLogo}
                alt="Incrix"
                width={50}
                height={16}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
