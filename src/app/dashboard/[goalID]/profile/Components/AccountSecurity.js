"use client";
import {
  Stack,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Devices, VpnKey } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { signOut } from "next-auth/react";

export default function AccountSecurity() {
  const { enqueueSnackbar } = useSnackbar();
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);

  useEffect(() => {
    const initSession = async () => {
      // 1. Get or create device ID
      let deviceId = localStorage.getItem("incrix_device_id");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("incrix_device_id", deviceId);
      }
      setCurrentDeviceId(deviceId);

      // 2. Register current session
      try {
        const response = await fetch("/api/user/active-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });

        if (response.status === 403) {
          const data = await response.json();
          if (data.action === "logout") {
            enqueueSnackbar("Session revoked. Signing out...", {
              variant: "error",
            });
            localStorage.removeItem("incrix_device_id");
            await signOut({ callbackUrl: "/signIn" });
            return;
          }
        }
      } catch (error) {
        console.error("Failed to register session", error);
      }

      // 3. Fetch all sessions
      fetchSessions();
    };

    initSession();
  }, [enqueueSnackbar]);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/user/active-sessions");
      const data = await response.json();
      if (data.success) {
        // Map pKey to deviceId for easier usage
        const mappedSessions = data.data.map((s) => ({
          ...s,
          deviceId: s.pKey.replace("SESSION#", ""),
        }));
        setSessions(mappedSessions);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  const handleRevokeSession = async (deviceId) => {
    // Optimistic update
    const previousSessions = [...sessions];
    setSessions(sessions.filter((s) => s.deviceId !== deviceId));

    try {
      const response = await fetch("/api/user/active-sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const data = await response.json();

      if (data.success) {
        enqueueSnackbar("Session revoked successfully", { variant: "success" });
        // We don't fetchSessions immediately to avoid GSI consistency issues
        // But we can schedule a fetch for later if needed
        setTimeout(fetchSessions, 2000);
      } else {
        // Revert on failure
        setSessions(previousSessions);
        enqueueSnackbar("Failed to revoke session", { variant: "error" });
      }
    } catch (error) {
      console.error("Error revoking session:", error);
      setSessions(previousSessions);
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar("New passwords do not match", { variant: "error" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar("Password changed successfully", {
          variant: "success",
        });
        setOpenPasswordDialog(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        enqueueSnackbar(data.message || "Failed to change password", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      enqueueSnackbar("An error occurred", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="24px">
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--text1)",
        }}
      >
        Account Security
      </Typography>

      {/* Password Section */}
      <Stack
        gap="16px"
        padding="20px"
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" gap="12px">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                backgroundColor: "#FFEBEE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VpnKey sx={{ fontSize: 20, color: "#F44336" }} />
            </Box>
            <Stack>
              <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
                Password
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                Secure your account with a strong password
              </Typography>
            </Stack>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenPasswordDialog(true)}
            sx={{
              textTransform: "none",
              borderColor: "var(--primary-color)",
              color: "var(--primary-color)",
              "&:hover": {
                borderColor: "var(--primary-color-dark)",
                backgroundColor: "var(--sec-color-acc-2)",
              },
            }}
          >
            Change Password
          </Button>
        </Stack>
      </Stack>

      {/* Active Sessions */}
      <Stack
        gap="16px"
        padding="20px"
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <Stack direction="row" alignItems="center" gap="12px">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              backgroundColor: "#E3F2FD",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Devices sx={{ fontSize: 20, color: "#2196F3" }} />
          </Box>
          <Typography sx={{ fontSize: "16px", fontWeight: 700 }}>
            Active Sessions
          </Typography>
        </Stack>

        <Stack gap="12px">
          {sessions.length === 0 ? (
            <Typography sx={{ fontSize: "14px", color: "var(--text3)" }}>
              Loading sessions...
            </Typography>
          ) : (
            sessions.map((session, index) => {
              const isCurrent = session.deviceId === currentDeviceId;
              return (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="12px"
                  sx={{
                    backgroundColor: isCurrent ? "#E8F5E9" : "var(--bg1)",
                    borderRadius: "8px",
                    border: isCurrent
                      ? "1px solid #4CAF50"
                      : "1px solid var(--border-color)",
                  }}
                >
                  <Stack gap="4px">
                    <Stack direction="row" alignItems="center" gap="8px">
                      <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                        {session.device} ({session.browser})
                      </Typography>
                      {isCurrent && (
                        <Box
                          sx={{
                            padding: "2px 8px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 700,
                          }}
                        >
                          CURRENT
                        </Box>
                      )}
                    </Stack>
                    <Typography
                      sx={{ fontSize: "12px", color: "var(--text3)" }}
                    >
                      {session.location} •{" "}
                      {new Date(session.lastActive).toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "var(--text3)" }}
                    >
                      IP: {session.ip}
                    </Typography>
                  </Stack>
                  {!isCurrent && (
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleRevokeSession(session.deviceId)}
                      sx={{ textTransform: "none" }}
                    >
                      Revoke
                    </Button>
                  )}
                </Stack>
              );
            })
          )}
        </Stack>
      </Stack>

      {/* Change Password Dialog */}
      <Dialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
      >
        <DialogTitle sx={{ fontFamily: "Lato", fontWeight: 700 }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          <Stack gap="16px" sx={{ mt: 1, minWidth: "300px" }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  oldPassword: e.target.value,
                })
              }
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenPasswordDialog(false)}
            sx={{ color: "var(--text3)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordChange}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: "var(--primary-color)" }}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
