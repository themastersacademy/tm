"use client";
import { useState } from "react";
import { Button, Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import gate_cse from "@/public/icons/gate_cse.svg";
import banking from "@/public/icons/banking.svg";
import placements from "@/public/icons/placements.svg";
import { ArrowBackIosRounded, East } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";

export default function GoalHead({ title, icon, isPro, bannerImage }) {
  const router = useRouter();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "org":
        return banking;
      case "castle":
        return gate_cse;
      default:
        return placements;
    }
  };

  return (
    <>
      {/* Hero Header with Cover Photo */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          height: { xs: "200px", md: "280px" },
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Background Image */}
        {bannerImage ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${bannerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.7)",
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
            }}
          />
        )}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: bannerImage
              ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
          }}
        />

        {/* Content */}
        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            padding: { xs: "20px", md: "32px" },
            justifyContent: "space-between",
          }}
        >
          {/* Top Section - Back Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => router.back()}
              startIcon={<ArrowBackIosRounded sx={{ fontSize: "16px" }} />}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                padding: "8px 16px",
                borderRadius: "12px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              Back
            </Button>

            {isPro && (
              <Button
                variant="contained"
                endIcon={<East />}
                onClick={handlePlansDialogOpen}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#FFD700",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "14px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)",
                  "&:hover": {
                    backgroundColor: "#FFC700",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(255, 215, 0, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Get Pro
              </Button>
            )}
          </Stack>

          {/* Bottom Section - Title & Icon */}
          <Stack direction="row" alignItems="center" gap="20px">
            {/* Goal Icon */}
            <Box
              sx={{
                width: { xs: "64px", md: "80px" },
                height: { xs: "64px", md: "80px" },
                borderRadius: "20px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              }}
            >
              <Image
                src={getIcon(icon)}
                alt="goal icon"
                width={40}
                height={40}
              />
            </Box>

            {/* Goal Title */}
            <Stack gap="8px" flex={1}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "24px", md: "32px" },
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "13px", md: "15px" },
                  fontWeight: 500,
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              >
                Master your learning journey
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </>
  );
}
