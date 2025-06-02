"use client";
import { useRouter, useParams } from "next/navigation";
import {
  Avatar,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import more_img from "@/public/icons/More.svg";
import students_img from "@/public/icons/Students.svg";
import logout_img from "@/public/icons/Logout.svg";
import { HowToRegRounded } from "@mui/icons-material";
import PlansDialogBox from "../PlansDialogBox/PlansDialogBox";
import { useSession, signOut } from "next-auth/react";
import { useSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

export default function Account({ isSideNavOpen }) {
  const params = useParams();
  const goalID = params.goalID;
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const open = Boolean(anchorEl);
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const userImage = session?.user?.image;

  // Debug session state and redirect on unauthenticated
  useEffect(() => {
    console.log("Account.js - Session Status:", status, "Session:", session);
    if (status === "unauthenticated") {
      console.log("Account.js - Redirecting to /signIn");
      router.push("/signIn");
    }
  }, [status, router]);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };

  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      handleClose();
    } catch (error) {
      console.error("Account.js - Logout error:", error);
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
      handleClose();
    }
  };

  return (
    <>
      <Stack
        onClick={handleClick}
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          borderRadius: "28px",
          cursor: "pointer",
          padding: isSideNavOpen ? "9px" : "4px 12px 4px 4px",
          backgroundColor: open ? "var(--primary-color-acc-2)" : "transparent",
          "&:hover": { backgroundColor: "var(--primary-color-acc-2)" },
        }}
      >
        <Stack sx={{ flexDirection: "row", alignItems: "center", gap: "12px" }}>
          <Tooltip title="Account" disableHoverListener={!isSideNavOpen}>
            {userImage ? (
              <Image
                src={userImage}
                alt="profile"
                width={45}
                height={45}
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <Avatar sx={{ width: 45, height: 45 }} />
            )}
          </Tooltip>
          {!isSideNavOpen && (
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "14px",
                fontWeight: "700",
                color: "var(--primary-color)",
              }}
            >
              My Account
            </Typography>
          )}
        </Stack>
        {!isSideNavOpen && (
          <Image
            src={more_img}
            alt="more"
            width={18}
            height={18}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "all .5s ease",
            }}
          />
        )}
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        autoFocus={false}
        disableScrollLock={true}
        sx={{
          "& .MuiPaper-root": {
            width: "240px",
            marginTop: "-90px",
            backgroundColor: "var(--sec-color-acc-2)",
            borderRadius: "6px",
            color: "var(--text3)",
            border: "1px solid var(--border-color)",
            "& .MuiMenuItem-root": {
              "&:hover": {
                backgroundColor: "var(--sec-color-acc-1)",
              },
              "&:active": {
                backgroundColor: "var(--sec-color-acc-1) !important",
              },
            },
          },
        }}
        elevation={0}
      >
        <MenuItem
          onClick={() => {
            router.push(`/dashboard/${goalID}/profile`);
            handleClose();
          }}
          sx={{
            gap: "15px",
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          <Image src={students_img} alt="profile" width={16} height={16} />
          Profile
        </MenuItem>
        {session?.user?.accountType !== "PRO" && (
          <MenuItem
            sx={{
              gap: "10px",
              fontFamily: "Lato",
              fontSize: "14px",
              fontWeight: "700",
            }}
            onClick={handlePlansDialogOpen}
          >
            <HowToRegRounded
              sx={{ color: "var(--primary-color)" }}
              fontSize="small"
            />
            Upgrade to PRO
          </MenuItem>
        )}
        <MenuItem
          onClick={handleLogout}
          sx={{
            gap: "15px",
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          <Image src={logout_img} alt="logout" width={16} height={16} />
          Logout
        </MenuItem>
      </Menu>
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </>
  );
}
