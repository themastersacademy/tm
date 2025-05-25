"use client";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import { Edit, Logout } from "@mui/icons-material";
import { Button, Stack, Typography, IconButton } from "@mui/material";
import incrix_logo from "@/public/images/incrix-logo.svg";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";
import VerticalTabs from "@/src/Components/VerticalTabs/VerticalTabs";
import BasicInfo from "./Components/BasicInfo";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };

  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  // Debug session state and redirect on unauthenticated
  useEffect(() => {
    console.log("Profile.js - Session Status:", status, "Session:", session);
    if (status === "unauthenticated") {
      console.log("Profile.js - Redirecting to /signIn");
      router.push("/signIn");
    }
  }, [status, router]);

  // Handle logout with feedback
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      enqueueSnackbar("Successfully logged out", {
        variant: "success",
        autoHideDuration: 3000,
        action: (key) => (
          <IconButton
            size="small"
            onClick={() => closeSnackbar(key)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        ),
      });
    } catch (error) {
      console.error("Profile.js - Logout error:", error);
      enqueueSnackbar("Failed to log out. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
        action: (key) => (
          <IconButton
            size="small"
            onClick={() => closeSnackbar(key)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        ),
      });
    }
  };

  if (status === "loading") {
    return <Typography>Loading</Typography>;
  }

  const tabsData = [
    {
      label: "Basic Info",
      content: <BasicInfo session={session} handleLogout={handleLogout} />,
    },
    { label: "Transaction", content: "Transaction" },
    // { label: "Payment", content: "Payment" },
  ];

  return (
    <>
      <MobileHeader />
      <Stack
        padding={{ xs: "10px", md: "20px" }}
        gap="20px"
        sx={{ minHeight: "100vh", overflowY: "visible" }}
        width="100%"
        alignItems="center"
      >
        <Stack width="100%" gap="20px" maxWidth="1200px" minHeight="100vh">
          <Stack
            sx={{
              display: { xs: "none", md: "block" },
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--white)",
              borderRadius: "10px",
              padding: "15px 20px",
              height: "60px",
              width: "100%",
            }}
          >
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
            >
              Profile
            </Typography>
          </Stack>
          <Stack
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between"
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Profile
            </Typography>
            <Button
              variant="text"
              endIcon={<Edit />}
              sx={{
                textTransform: "none",
                fontFamily: "Lato",
                fontSize: "16px",
                color: "var(--primary-color)",
                padding: "2px",
                display: { xs: "flex", md: "none" },
              }}
            >
              Edit
            </Button>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            gap="20px"
            width="100%"
            justifyContent="space-between"
          >
            <Stack
              sx={{
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                width: "100%",
                minHeight: "600px",
                backgroundColor: "var(--white)",
                padding: "20px",
                gap: "15px",
                maxWidth: "1200px",
              }}
            >
              <VerticalTabs tabs={tabsData} />
            </Stack>
          </Stack>
          <Stack direction="row" gap="8px" justifyContent="space-between">
            <Button
              variant="contained"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontFamily: "Lato",
                fontSize: "16px",
                backgroundColor: "var(--delete-color)",
                borderRadius: "6px",
                width: "160px",
                display: { xs: "flex", md: "none" },
              }}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              onClick={handlePlansDialogOpen}
              sx={{
                textTransform: "none",
                fontFamily: "Lato",
                fontSize: "14px",
                backgroundColor: "var(--primary-color)",
                width: "150px",
                display: { xs: "flex", md: "none" },
              }}
            >
              Upgrade To Pro
            </Button>
          </Stack>

          <Stack
            sx={{
              marginTop: "auto",
              gap: "5px",
              paddingBottom: { xs: "50px", md: "0px" },
            }}
          >
            <Image src={incrix_logo} alt="logo" style={{ color: "red" }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--text3)",
              }}
            >
              Crafted by Incrix Techlutions LLP, Tamil Nadu.
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
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
