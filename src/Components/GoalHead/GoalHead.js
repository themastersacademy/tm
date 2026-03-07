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
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          position: "relative",
          borderRadius: "10px",
          overflow: "hidden",
          height: { xs: "180px", md: "240px" },
        }}
      >
        {/* Background */}
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

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: bannerImage
              ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        {/* Content */}
        <Stack
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            padding: { xs: "16px", md: "20px 24px" },
            justifyContent: "space-between",
          }}
        >
          {/* Top - Back Button */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => router.back()}
              startIcon={<ArrowBackIosRounded sx={{ fontSize: "14px" }} />}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "13px",
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                padding: "6px 14px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                },
                transition: "all 0.15s ease",
              }}
            >
              Back
            </Button>

            {isPro && (
              <Button
                variant="contained"
                endIcon={<East sx={{ fontSize: 16 }} />}
                onClick={handlePlansDialogOpen}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#FFD700",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "13px",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#FFC700",
                  },
                  transition: "all 0.15s ease",
                }}
              >
                Get Pro
              </Button>
            )}
          </Stack>

          {/* Bottom - Title & Icon */}
          <Stack direction="row" alignItems="center" gap="14px">
            <Box
              sx={{
                width: { xs: "48px", md: "56px" },
                height: { xs: "48px", md: "56px" },
                borderRadius: "10px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={getIcon(icon)}
                alt="goal icon"
                width={28}
                height={28}
              />
            </Box>

            <Stack gap="4px" flex={1}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: { xs: "18px", md: "22px" },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "13px",
                  fontWeight: 500,
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
