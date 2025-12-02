"use client";
import {
  Stack,
  Typography,
  Box,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import {
  School,
  CheckCircle,
  EmojiEvents,
  CalendarToday,
} from "@mui/icons-material";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfileHeader({ session, userProfileData }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/user/dashboard-stats");
        const data = await response.json();
        if (data.success) {
          setStats(data.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  const memberSince = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const isPro = session?.user?.accountType === "PRO";

  // Calculate profile completion
  const calculateCompletion = () => {
    let completed = 0;
    const total = 5;
    if (userProfileData?.name) completed++;
    if (userProfileData?.email) completed++;
    if (userProfileData?.phoneNumber) completed++;
    if (userProfileData?.gender) completed++;
    if (userProfileData?.image) completed++;
    return Math.round((completed / total) * 100);
  };

  const completionPercent = userProfileData ? calculateCompletion() : 0;

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* Cover Photo with Gradient */}
      <Box
        sx={{
          height: { xs: "120px", md: "180px" },
          background: `linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
      </Box>

      {/* Profile Content */}
      <Stack
        padding={{ xs: "0 16px 20px", md: "0 32px 32px" }}
        gap="20px"
        sx={{ marginTop: "-50px", position: "relative", zIndex: 1 }}
      >
        {/* Avatar and Basic Info Row */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "center", md: "flex-end" }}
          justifyContent="space-between"
          gap="20px"
        >
          {/* Avatar */}
          <Stack alignItems={{ xs: "center", md: "flex-start" }} gap="12px">
            <Box
              sx={{
                position: "relative",
                border: "4px solid white",
                borderRadius: "50%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {userProfileData?.image ? (
                <Image
                  src={userProfileData.image}
                  alt="profile"
                  width={100}
                  height={100}
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <Avatar sx={{ width: 100, height: 100, fontSize: "40px" }}>
                  {userProfileData?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              )}
            </Box>

            {/* Name and Account Type */}
            <Stack alignItems={{ xs: "center", md: "flex-start" }} gap="8px">
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {userProfileData?.name || "User"}
              </Typography>

              <Stack direction="row" gap="8px" alignItems="center">
                <Chip
                  label={isPro ? "PRO Member" : "Free Account"}
                  size="small"
                  sx={{
                    backgroundColor: isPro ? "#FFD700" : "var(--primary-color)",
                    color: isPro ? "#000" : "white",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                />
                <Stack direction="row" alignItems="center" gap="4px">
                  <CalendarToday sx={{ fontSize: 14, color: "var(--text3)" }} />
                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                    Member since {memberSince}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          {/* Quick Stats */}
          <Stack
            direction="row"
            gap="24px"
            sx={{
              padding: "16px 24px",
              backgroundColor: "var(--bg1)",
              borderRadius: "12px",
            }}
          >
            {loading ? (
              <Stack direction="row" gap="24px">
                <Skeleton width={60} height={60} />
                <Skeleton width={60} height={60} />
                <Skeleton width={60} height={60} />
              </Stack>
            ) : (
              <>
                <Stack alignItems="center" gap="4px">
                  <Stack direction="row" alignItems="center" gap="4px">
                    <School
                      sx={{ fontSize: 18, color: "var(--primary-color)" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      {stats?.totalCourses || 0}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                    Courses
                  </Typography>
                </Stack>

                <Stack alignItems="center" gap="4px">
                  <Stack direction="row" alignItems="center" gap="4px">
                    <CheckCircle sx={{ fontSize: 18, color: "#4CAF50" }} />
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      {stats?.completedCourses || 0}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                    Completed
                  </Typography>
                </Stack>

                <Stack alignItems="center" gap="4px">
                  <Stack direction="row" alignItems="center" gap="4px">
                    <EmojiEvents sx={{ fontSize: 18, color: "#FFD700" }} />
                    <Typography
                      sx={{
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      {stats?.certificates || 0}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                    Certificates
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>

        {/* Profile Completion */}
        <Stack gap="8px">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text2)",
              }}
            >
              Profile Completion
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--primary-color)",
              }}
            >
              {completionPercent}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={completionPercent}
            sx={{
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "var(--bg1)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "var(--primary-color)",
                borderRadius: "4px",
              },
            }}
          />
          {completionPercent < 100 && (
            <Typography
              sx={{
                fontSize: "12px",
                color: "var(--text3)",
                fontStyle: "italic",
              }}
            >
              Complete your profile to unlock all features
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
