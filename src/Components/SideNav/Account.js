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
      <Tooltip
        title={isSideNavOpen ? session?.user?.name || "Account" : ""}
        placement="right"
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "var(--text1)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "6px",
            },
          },
        }}
      >
        <Stack
          onClick={handleClick}
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            borderRadius: "8px",
            cursor: "pointer",
            padding: isSideNavOpen ? "8px" : "8px 10px",
            backgroundColor: open
              ? "rgba(24, 113, 99, 0.06)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(24, 113, 99, 0.06)",
            },
          }}
        >
          <Stack
            sx={{ flexDirection: "row", alignItems: "center", gap: "10px" }}
          >
            <Stack position="relative">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="profile"
                  width={32}
                  height={32}
                  style={{
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "var(--primary-color)",
                    fontSize: "13px",
                    fontWeight: 700,
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
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    border: "1.5px solid white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "7px", fontWeight: "bold", color: "#000" }}
                  >
                    P
                  </Typography>
                </Stack>
              )}
            </Stack>
            {!isSideNavOpen && (
              <Stack gap="1px">
                <Stack direction="row" alignItems="center" gap="4px">
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--text1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "120px",
                    }}
                  >
                    {session?.user?.name || "User"}
                  </Typography>
                  {session?.user?.accountType === "PRO" && (
                    <Stack
                      sx={{
                        backgroundColor: "#FFD700",
                        padding: "1px 4px",
                        borderRadius: "3px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "9px",
                          fontWeight: 800,
                          color: "#000",
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
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--text3)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "140px",
                  }}
                >
                  {session?.user?.email || "user@example.com"}
                </Typography>
              </Stack>
            )}
          </Stack>
          {!isSideNavOpen && (
            <Image
              src={more_img}
              alt="more"
              width={16}
              height={16}
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.2s ease",
                opacity: 0.6,
              }}
            />
          )}
        </Stack>
      </Tooltip>

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
            width: "220px",
            marginLeft: "10px",
            backgroundColor: "var(--white)",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            "& .MuiMenuItem-root": {
              borderRadius: "6px",
              margin: "2px 6px",
              padding: "8px 10px",
              gap: "10px",
              "&:hover": {
                backgroundColor: "rgba(24, 113, 99, 0.06)",
              },
            },
          },
        }}
        elevation={0}
      >
        <Stack padding="10px 14px 6px" gap="2px">
          <Stack direction="row" alignItems="center" gap="4px">
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
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
              fontSize: "11px",
              color: "var(--text3)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {session?.user?.email}
          </Typography>
        </Stack>
        <Divider sx={{ margin: "6px 0" }} />

        <MenuItem
          onClick={() => {
            router.push(`/dashboard/${goalID}/profile`);
            handleClose();
          }}
        >
          <Stack
            sx={{
              width: "28px",
              height: "28px",
              backgroundColor: "rgba(24, 113, 99, 0.06)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={students_img} alt="profile" width={14} height={14} />
          </Stack>
          <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
            Profile
          </Typography>
        </MenuItem>

        {session?.user?.accountType !== "PRO" && (
          <MenuItem onClick={handlePlansDialogOpen}>
            <Stack
              sx={{
                width: "28px",
                height: "28px",
                backgroundColor: "rgba(24, 113, 99, 0.06)",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HowToRegRounded
                sx={{ color: "var(--primary-color)", fontSize: "14px" }}
              />
            </Stack>
            <Stack>
              <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                Upgrade Plan
              </Typography>
              <Typography sx={{ fontSize: "10px", color: "var(--text3)" }}>
                Unlock all features
              </Typography>
            </Stack>
          </MenuItem>
        )}

        <Divider sx={{ margin: "6px 0" }} />

        <MenuItem onClick={handleLogout}>
          <Stack
            sx={{
              width: "28px",
              height: "28px",
              backgroundColor: "rgba(244, 67, 54, 0.08)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image src={logout_img} alt="logout" width={14} height={14} />
          </Stack>
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, color: "#F44336" }}
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
