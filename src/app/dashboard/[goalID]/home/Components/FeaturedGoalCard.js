"use client";
import { Stack, Typography, Box, Button, Chip } from "@mui/material";
import Image from "next/image";
import { ArrowForward, Star } from "@mui/icons-material";
import gate_cse from "@/public/icons/gate_cse.svg";
import placement from "@/public/icons/placements.svg";
import Banking from "@/public/icons/banking.svg";

export default function FeaturedGoalCard({ goal, onExplore }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "castle":
        return gate_cse;
      case "org":
        return placement;
      case "institute":
        return Banking;
      default:
        return gate_cse;
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "300px" },
        borderRadius: "20px",
        background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)",
        border: "2px solid var(--primary-color)",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 16px 40px rgba(33, 150, 243, 0.25)",
        },
      }}
      onClick={onExplore}
    >
      {/* Featured Ribbon */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: -32,
          backgroundColor: "#FFD700",
          color: "#000",
          padding: "6px 40px",
          transform: "rotate(45deg)",
          fontSize: "12px",
          fontWeight: 700,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 2,
        }}
      >
        <Stack direction="row" alignItems="center" gap="4px">
          <Star sx={{ fontSize: 14 }} />
          FEATURED
        </Stack>
      </Box>

      <Stack padding="28px" gap="20px">
        {/* Icon */}
        <Box
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 20px rgba(33, 150, 243, 0.3)",
          }}
        >
          <Image
            src={getIcon(goal.icon)}
            alt={goal.title}
            width={48}
            height={48}
            style={{
              filter: "brightness(0) invert(1)",
            }}
          />
        </Box>

        {/* Content */}
        <Stack gap="12px">
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 800,
              color: "var(--text1)",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            {goal.title}
          </Typography>

          {goal.tagline && (
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {goal.tagline}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: "14px",
              color: "var(--text2)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {goal.description || "Discover comprehensive learning resources"}
          </Typography>
        </Stack>

        {/* Stats */}
        <Stack direction="row" gap="12px" flexWrap="wrap">
          {goal.coursesCount > 0 && (
            <Chip
              label={`${goal.coursesCount} Courses`}
              size="small"
              sx={{
                backgroundColor: "var(--primary-color-acc-2)",
                color: "var(--primary-color)",
                fontWeight: 600,
              }}
            />
          )}
          {goal.subjectsCount > 0 && (
            <Chip
              label={`${goal.subjectsCount} Subjects`}
              size="small"
              sx={{
                backgroundColor: "var(--sec-color-acc-2)",
                color: "var(--sec-color)",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>

        {/* CTA */}
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          fullWidth
          sx={{
            backgroundColor: "var(--primary-color)",
            color: "white",
            fontWeight: 700,
            padding: "12px",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "var(--primary-color-dark)",
            },
          }}
        >
          Explore Now
        </Button>
      </Stack>
    </Box>
  );
}
