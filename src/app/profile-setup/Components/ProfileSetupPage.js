// ProfileSetupPage.js
"use client";
import Image from "next/image";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { enqueueSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { CircularProgress } from "@mui/material";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import gate_cse from "@/public/icons/gate_cse.svg";
import placement from "@/public/icons/placements.svg";
import Banking from "@/public/icons/banking.svg";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";
export default function ProfileSetupPage({ isMobile }) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [selectedGoal, setSelectedGoal] = useState({
    goalID: "",
    icon: "",
    title: "",
  });
  const [goals, setGoals] = useState([]); // Store API fetched goals
  const [loading, setLoading] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  // Check if goal query param is true
  const isGoalSelection = searchParams.get("goal") === "true";

  // Fetch goal list from API and set initial profile data
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goal/all");
        const result = await response.json();
        if (result.success) {
          setGoals(result.data); // Store the array of goals
        } else {
          enqueueSnackbar("Failed to fetch goals", { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar("An error occurred while fetching goals", {
          variant: "error",
        });
      }
    };
    fetchGoals();

    if (session) {
      setName(session?.user?.name || "");
      setPhoneNumber(session?.user?.phoneNumber || "");
      setGender(session?.user?.gender || "");
      if (
        session?.user?.name &&
        session?.user?.phoneNumber &&
        session?.user?.gender &&
        !isGoalSelection
      ) {
        setIsProfileUpdated(true);
      }
    }
  }, [session, isGoalSelection]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/profile-update", {
        method: "POST",
        body: JSON.stringify({ name, phoneNumber, gender }),
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Profile updated successfully", { variant: "success" });
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
        enqueueSnackbar("Goal set successfully", { variant: "success" });
        await update();
        router.push("/dashboard");
      } else {
        enqueueSnackbar(data.message || "Failed to set goal", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "An error occurred", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace("+91", "").replace(/[^0-9]/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const renderGoalSelection = () => (
    <Stack gap="20px">
      <Typography
        sx={{
          fontFamily: "Lato",
          fontSize: "20px",
          fontWeight: "500",
          color: "var(--text2)",
        }}
      >
        Select goal
      </Typography>
      <Stack gap="25px" flexDirection="row">
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
                    : gate_cse // Default fallback
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
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "350px",
        }}
        disableElevation
        disabled={
          loading ||
          !selectedGoal.goalID ||
          !selectedGoal.icon ||
          !selectedGoal.title
        }
        startIcon={
          loading ? (
            <CircularProgress
              size={20}
              sx={{ color: "var(--primary-color)" }}
            />
          ) : null
        }
        onClick={handleGoalSubmit}
      >
        Create
      </Button>
    </Stack>
  );

  return (
    <Stack
      width={isMobile ? "100%" : "50%"}
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Suspense
        fallback={<CircularProgress sx={{ color: "var(--primary-color)" }} />}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Stack
            sx={{
              width: isMobile ? "80px" : "110px",
              height: isMobile ? "80px" : "110px",
              backgroundColor: "var(--border-color)",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack
              sx={{
                width: isMobile ? "50px" : "70px",
                height: isMobile ? "50px" : "70px",
                backgroundColor: "var(--white)",
                borderRadius: "50px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={mastersLogo}
                alt="logo"
                width={isMobile ? 32 : 48}
                height={isMobile ? 32 : 48}
              />
            </Stack>
          </Stack>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "600",
              color: "var(--text1)",
              marginTop: "15px",
              marginBottom: "35px",
            }}
          >
            Profile Setup
          </Typography>
          <Suspense
            fallback={
              <CircularProgress sx={{ color: "var(--primary-color)" }} />
            }
          >
            <Stack
              sx={{ width: "350px", gap: "20px", justifyContent: "center" }}
            >
              {isGoalSelection ? (
                renderGoalSelection()
              ) : !isProfileUpdated ? (
                <>
                  <Stack gap={1}>
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "var(--text2)",
                      }}
                    >
                      Name
                    </Typography>
                    <StyledTextField
                      placeholder="Enter your full name"
                      sx={{ width: "350px" }}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Stack>
                  <Stack gap={1}>
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "var(--text2)",
                      }}
                    >
                      Phone Number
                    </Typography>
                    <StyledTextField
                      placeholder="+91 1234567890"
                      sx={{ width: "350px" }}
                      value={`+91 ${phoneNumber}`}
                      onChange={handlePhoneNumberChange}
                      inputProps={{ maxLength: 14, inputMode: "numeric" }}
                      type="tel"
                    />
                  </Stack>
                  <Stack gap={1}>
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "var(--text2)",
                      }}
                    >
                      Gender
                    </Typography>
                    <StyledSelect
                      options={["Male", "Female", "Other"]}
                      title="Your Gender"
                      getLabel={(option) => option}
                      getValue={(option) => option}
                      value={gender || ""}
                      onChange={(e) => setGender(e.target.value)}
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "var(--primary-color)",
                      borderRadius: "4px",
                      fontFamily: "Lato",
                      fontSize: "18px",
                      height: "40px",
                      width: "350px",
                    }}
                    disableElevation
                    disabled={loading || !name || !phoneNumber || !gender}
                    startIcon={
                      loading ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: "var(--primary-color)" }}
                        />
                      ) : null
                    }
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </>
              ) : (
                renderGoalSelection()
              )}
            </Stack>
          </Suspense>
        </Stack>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          width="100%"
          justifyContent={{ xs: "center", md: "space-between" }}
          alignItems="center"
          sx={{ fontFamily: "Lato", padding: "20px", marginTop: "auto" }}
        >
          <Stack>
            <Typography
              sx={{
                marginTop: "auto",
                marginRight: "auto",
                fontFamily: "Lato",
                fontSize: isMobile ? "12px" : "16px",
                fontWeight: "700",
                color: "var(--text4)",
              }}
            >
              ©2025 @ The Masters Academy
            </Typography>
          </Stack>
          <Stack flexDirection="row" alignItems="center" gap="10px">
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: isMobile ? "12px" : "16px",
                fontWeight: "700",
                color: "var(--text4)",
              }}
            >
              Designed By
            </Typography>
            <Image
              src={incrixLogo}
              alt="incrix"
              width={isMobile ? 52 : 104}
              height={isMobile ? 24 : 48}
            />
          </Stack>
        </Stack>
      </Suspense>
    </Stack>
  );
}
