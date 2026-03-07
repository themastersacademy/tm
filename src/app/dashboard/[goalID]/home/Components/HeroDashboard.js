"use client";
import { Stack, Typography, Box, Button } from "@mui/material";
import {
  School,
  AccessTime,
  EmojiEvents,
  ArrowForward,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";

export default function HeroDashboard({ userName, stats }) {
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;

  const {
    coursesEnrolled = 0,
    hoursCompleted = 0,
    certificates = 0,
  } = stats || {};

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
        borderRadius: "10px",
        padding: { xs: "16px", md: "20px 24px" },
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Stack gap="16px" position="relative" zIndex={1}>
        {/* Welcome message */}
        <Stack gap="4px">
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "20px" },
              fontWeight: 700,
            }}
          >
            Welcome back, {userName || "Student"}!
          </Typography>
          <Typography
            sx={{
              fontSize: "13px",
              opacity: 0.85,
              fontWeight: 500,
            }}
          >
            Continue your learning journey
          </Typography>
        </Stack>

        {/* Quick stats */}
        <Stack direction="row" gap={{ xs: "12px", md: "24px" }} flexWrap="wrap">
          <StatBadge
            icon={<School sx={{ fontSize: 18 }} />}
            value={coursesEnrolled}
            label="Courses"
          />
          <StatBadge
            icon={<AccessTime sx={{ fontSize: 18 }} />}
            value={hoursCompleted}
            label="Hours"
          />
          <StatBadge
            icon={<EmojiEvents sx={{ fontSize: 18 }} />}
            value={certificates}
            label="Certificates"
          />
        </Stack>

        {/* CTA Button */}
        <Box>
          <Button
            variant="contained"
            endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
            onClick={() => router.push(`/dashboard/${goalID}/courses`)}
            sx={{
              backgroundColor: "white",
              color: "var(--primary-color)",
              fontWeight: 700,
              fontSize: "13px",
              padding: "8px 20px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
              transition: "all 0.15s ease",
            }}
          >
            Explore Courses
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

function StatBadge({ icon, value, label }) {
  return (
    <Stack direction="row" alignItems="center" gap="8px">
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "8px",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Stack>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            opacity: 0.8,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Stack>
  );
}
