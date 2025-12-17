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
  Divider,
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
    if (status === "unauthenticated") {
      router.push("/signIn");
    }
  }, [status, session, router]);

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
          marginTop: "auto",
          borderRadius: "12px",
          cursor: "pointer",
          padding: !isSideNavOpen ? "12px" : "8px",
          backgroundColor: open ? "var(--primary-color-acc-2)" : "transparent",
          border: "1px solid transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "var(--primary-color-acc-2)",
            borderColor: "var(--border-color)",
          },
          width: "100%",
          justifyContent: !isSideNavOpen ? "flex-start" : "center",
        }}
      >
        <Tooltip
          title={isSideNavOpen ? session?.user?.name || "Account" : ""}
          placement="right"
        >
          <Stack position="relative">
            {userImage ? (
              <Image
                src={userImage}
                alt="profile"
                width={40}
                height={40}
                style={{
                  borderRadius: "50%",
                  border: "2px solid var(--white)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "var(--primary-color)",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {session?.user?.name?.charAt(0) || "U"}
              </Avatar>
            )}
            {session?.user?.accountType === "PRO" && isSideNavOpen && (
              <Stack
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  bgcolor: "#FFD700",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  border: "2px solid white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: "8px", fontWeight: "bold", color: "#000" }}
                >
                  P
                </Typography>
              </Stack>
            )}
          </Stack>
        </Tooltip>

        {!isSideNavOpen && (
          <Stack sx={{ ml: 1.5, overflow: "hidden", flex: 1 }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "var(--text1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontFamily: "Lato",
                }}
              >
                {session?.user?.name || "User"}
              </Typography>
              {session?.user?.accountType === "PRO" && (
                <Stack
                  sx={{
                    backgroundColor: "#FFD700",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: "800",
                      color: "#000",
                      fontFamily: "Lato",
                      lineHeight: 1,
                    }}
                  >
                    PRO
                  </Typography>
                </Stack>
              )}
            </Stack>
            <Typography
              sx={{
                fontSize: "12px",
                color: "var(--text3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Lato",
              }}
            >
              {session?.user?.email || "user@example.com"}
            </Typography>
          </Stack>
        )}

        {!isSideNavOpen && (
          <Image
            src={more_img}
            alt="more"
            width={16}
            height={16}
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0)",
              transition: "all .3s ease",
              opacity: 0.6,
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
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          "& .MuiPaper-root": {
            width: "260px",
            marginLeft: "10px",
            backgroundColor: "var(--white)",
            borderRadius: "12px",
            color: "var(--text1)",
            border: "1px solid var(--border-color)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            "& .MuiMenuItem-root": {
              padding: "10px 16px",
              gap: "12px",
              "&:hover": {
                backgroundColor: "var(--sec-color-acc-2)",
              },
            },
          },
        }}
        elevation={0}
      >
        {/* Menu Header */}
        <Stack sx={{ p: "16px 16px 12px 16px", gap: 1.5, outline: "none" }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            {userImage ? (
              <Image
                src={userImage}
                alt="profile"
                width={48}
                height={48}
                style={{
                  borderRadius: "50%",
                  border: "1px solid var(--border-color)",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "var(--primary-color)",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {session?.user?.name?.charAt(0) || "U"}
              </Avatar>
            )}
            <Stack sx={{ overflow: "hidden" }}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "15px",
                    fontFamily: "Lato",
                    color: "var(--text1)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "140px",
                  }}
                >
                  {session?.user?.name || "User"}
                </Typography>
                {session?.user?.accountType === "PRO" && (
                  <Stack
                    sx={{ bgcolor: "#FFD700", px: 0.5, borderRadius: "3px" }}
                  >
                    <Typography
                      sx={{ fontSize: "9px", fontWeight: 800, color: "black" }}
                    >
                      PRO
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "var(--text3)",
                  fontFamily: "Lato",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px",
                }}
              >
                {session?.user?.email}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            onClick={() => {
              router.push(`/dashboard/${goalID}/profile`);
              handleClose();
            }}
            sx={{
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              py: 0.5,
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "var(--sec-color-acc-2)",
                borderColor: "var(--primary-color)",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text2)",
                fontFamily: "Lato",
              }}
            >
              Manage Account
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            router.push(`/dashboard/${goalID}/profile`);
            handleClose();
          }}
        >
          <Stack
            sx={{
              bgcolor: "var(--sec-color-acc-2)",
              p: 0.8,
              borderRadius: "6px",
            }}
          >
            <Image src={students_img} alt="profile" width={18} height={18} />
          </Stack>
          <Typography
            sx={{ fontSize: "14px", fontWeight: 600, fontFamily: "Lato" }}
          >
            Profile
          </Typography>
        </MenuItem>

        {session?.user?.accountType !== "PRO" && (
          <MenuItem onClick={handlePlansDialogOpen}>
            <Stack
              sx={{
                bgcolor: "var(--sec-color-acc-2)",
                p: 0.8,
                borderRadius: "6px",
              }}
            >
              <HowToRegRounded
                sx={{ color: "var(--primary-color)", fontSize: "18px" }}
              />
            </Stack>
            <Stack>
              <Typography
                sx={{ fontSize: "14px", fontWeight: 600, fontFamily: "Lato" }}
              >
                Upgrade Plan
              </Typography>
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "var(--text3)",
                  fontFamily: "Lato",
                }}
              >
                Unlock all features
              </Typography>
            </Stack>
          </MenuItem>
        )}

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "var(--delete-color)" }}>
          <Stack sx={{ bgcolor: "#FEE2E2", p: 0.8, borderRadius: "6px" }}>
            <Image src={logout_img} alt="logout" width={18} height={18} />
          </Stack>
          <Typography
            sx={{ fontSize: "14px", fontWeight: 600, fontFamily: "Lato" }}
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </>
  );
}
