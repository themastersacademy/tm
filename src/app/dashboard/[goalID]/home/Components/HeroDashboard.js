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
        borderRadius: "20px",
        padding: { xs: "24px", md: "32px" },
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(33, 150, 243, 0.2)",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />

      <Stack gap="24px" position="relative" zIndex={1}>
        {/* Welcome message */}
        <Stack gap="8px">
          <Typography
            sx={{
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            🎓 Welcome back, {userName || "Student"}!
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              opacity: 0.9,
              fontWeight: 500,
            }}
          >
            Continue your learning journey
          </Typography>
        </Stack>

        {/* Quick stats */}
        <Stack direction="row" gap={{ xs: "16px", md: "32px" }} flexWrap="wrap">
          <StatBadge
            icon={<School sx={{ fontSize: 24 }} />}
            value={coursesEnrolled}
            label="Courses"
          />
          <StatBadge
            icon={<AccessTime sx={{ fontSize: 24 }} />}
            value={hoursCompleted}
            label="Hours"
          />
          <StatBadge
            icon={<EmojiEvents sx={{ fontSize: 24 }} />}
            value={certificates}
            label="Certificates"
          />
        </Stack>

        {/* CTA Button */}
        <Box>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => router.push(`/dashboard/${goalID}/courses`)}
            sx={{
              backgroundColor: "white",
              color: "var(--primary-color)",
              fontWeight: 700,
              fontSize: "16px",
              padding: "12px 24px",
              borderRadius: "12px",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease",
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
    <Stack direction="row" alignItems="center" gap="12px">
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: "12px",
          padding: "12px",
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
            fontSize: "28px",
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
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
