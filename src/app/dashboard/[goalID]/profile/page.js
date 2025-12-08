"use client";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import { Logout } from "@mui/icons-material";
import { Button, Stack, Typography, CircularProgress } from "@mui/material";
import incrix_logo from "@/public/images/incrix-logo.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";
import CustomTabs from "@/src/Components/CustomTabs/CustomTabs";
import BasicInfo from "./Components/BasicInfo";
import UserTransaction from "./Components/userTransaction";
import ProfileHeader from "./Components/ProfileHeader";
import QuickActions from "./Components/QuickActions";
import Preferences from "./Components/Preferences";
import AccountSecurity from "./Components/AccountSecurity";

export default function Profile({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };

  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signIn");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch("/api/user/profile-data");
        const data = await response.json();
        if (data.success) {
          setUserProfileData(data.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    if (status === "authenticated") {
      fetchUserProfileData();
    }
  }, [status]);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      enqueueSnackbar("Successfully logged out", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      enqueueSnackbar("Failed to log out. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case "certificates":
        enqueueSnackbar("Certificates feature coming soon!", {
          variant: "info",
        });
        break;
      case "invoices":
        setActiveTab(2); // Switch to Transactions tab (now index 2)
        // Scroll to tabs section smoothly
        const tabsElement = document.getElementById("profile-tabs");
        if (tabsElement) {
          tabsElement.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "support":
        window.location.href = "mailto:support@incrix.com";
        break;
      case "refer":
        navigator.clipboard.writeText("https://incrix.com/join");
        enqueueSnackbar("Referral link copied to clipboard", {
          variant: "success",
        });
        break;
      default:
        break;
    }
  };

  if (status === "loading") {
    return (
      <Stack alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading...</Typography>
      </Stack>
    );
  }

  const tabsData = [
    {
      label: "Personal Info",
      content: (
        <BasicInfo
          session={session}
          handleLogout={handleLogout}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          userProfileData={userProfileData}
          setUserProfileData={setUserProfileData}
        />
      ),
    },
    {
      label: "Security",
      content: <AccountSecurity />,
    },
    {
      label: "Transactions",
      content: <UserTransaction userID={session?.user?.id} />,
    },
    {
      label: "Preferences",
      content: <Preferences />,
    },
  ];

  return (
    <>
      <MobileHeader />
      <Stack
        padding={{ xs: "10px", md: "20px" }}
        gap="24px"
        sx={{
          minHeight: "100vh",
          backgroundColor: "var(--bg1)",
        }}
        width="100%"
        alignItems="center"
      >
        <Stack width="100%" gap="24px" maxWidth="1200px">
          {/* Profile Header */}
          <ProfileHeader session={session} userProfileData={userProfileData} />

          {/* Quick Actions */}
          <QuickActions onAction={handleQuickAction} />

          {/* Main Content Area with Tabs */}
          <Stack
            id="profile-tabs"
            sx={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid var(--border-color)",
              padding: { xs: "16px", md: "24px" },
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <CustomTabs
              tabs={tabsData}
              activeIndex={activeTab}
              onTabChange={setActiveTab}
            />
          </Stack>

          {/* Mobile Actions */}
          <Stack
            direction="row"
            gap="12px"
            justifyContent="space-between"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                backgroundColor: "var(--delete-color)",
                borderRadius: "10px",
                flex: 1,
                "&:hover": {
                  backgroundColor: "#D32F2F",
                },
              }}
            >
              Logout
            </Button>
            {session?.user?.accountType !== "PRO" && (
              <Button
                variant="contained"
                onClick={handlePlansDialogOpen}
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  backgroundColor: "var(--primary-color)",
                  borderRadius: "10px",
                  flex: 1,
                  "&:hover": {
                    backgroundColor: "var(--primary-color-dark)",
                  },
                }}
              >
                Upgrade To Pro
              </Button>
            )}
          </Stack>

          {/* Footer */}
          <Stack
            sx={{
              marginTop: "auto",
              gap: "8px",
              paddingBottom: { xs: "80px", md: "20px" },
              alignItems: "center",
            }}
          >
            <Image src={incrix_logo} alt="logo" />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--text3)",
                textAlign: "center",
              }}
            >
              Crafted by Incrix Techlutions LLP, Tamil Nadu, India
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "var(--text3)",
              }}
            >
              Version: 1.0.1
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </>
  );
}
