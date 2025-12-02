"use client";
import {
  Stack,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Skeleton,
} from "@mui/material";
import { Notifications, Lock } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

export default function Preferences() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    examReminders: true,
    marketingEmails: false,
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        const data = await response.json();
        if (data.success && data.data) {
          setSettings((prev) => ({ ...prev, ...data.data }));
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "POST",
        body: JSON.stringify(newSettings),
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Preferences updated", { variant: "success" });
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      enqueueSnackbar("Failed to update preferences", { variant: "error" });
      // Revert on error
      setSettings(settings);
    }
  };

  if (loading) {
    return (
      <Stack gap="24px">
        <Skeleton height={40} width={200} />
        <Skeleton height={200} />
        <Skeleton height={200} />
      </Stack>
    );
  }

  return (
    <Stack gap="24px">
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--text1)",
        }}
      >
        Preferences
      </Typography>

      {/* Notifications Section */}
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
            <Notifications sx={{ fontSize: 20, color: "#2196F3" }} />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text1)",
            }}
          >
            Notifications
          </Typography>
        </Stack>

        <Stack gap="12px">
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                color="primary"
              />
            }
            label={
              <Stack>
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Email Notifications
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                  Receive email updates about your account
                </Typography>
              </Stack>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.courseUpdates}
                onChange={() => handleToggle("courseUpdates")}
                color="primary"
              />
            }
            label={
              <Stack>
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Course Updates
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                  Get notified about new courses and updates
                </Typography>
              </Stack>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.examReminders}
                onChange={() => handleToggle("examReminders")}
                color="primary"
              />
            }
            label={
              <Stack>
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Exam Reminders
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                  Receive reminders for upcoming exams
                </Typography>
              </Stack>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.marketingEmails}
                onChange={() => handleToggle("marketingEmails")}
                color="primary"
              />
            }
            label={
              <Stack>
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Marketing Emails
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                  Receive promotional offers and news
                </Typography>
              </Stack>
            }
          />
        </Stack>
      </Stack>

      {/* Privacy Section */}
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
              backgroundColor: "#FFF3E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Lock sx={{ fontSize: 20, color: "#FF9800" }} />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text1)",
            }}
          >
            Privacy
          </Typography>
        </Stack>

        <Stack gap="8px">
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            Profile Visibility
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "var(--text3)" }}>
            Your profile is currently visible to instructors and administrators
            only.
          </Typography>
        </Stack>

        <Stack gap="8px">
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            Data Privacy
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "var(--text3)" }}>
            Your personal information is secure and encrypted. We never share
            your data with third parties.
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
