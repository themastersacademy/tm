import { Button, Stack, Typography, Box } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import institute from "@/public/icons/institute1.svg";
import agrade from "@/public/icons/aGrade.svg";
import crackExamBanner from "@/public/images/crackExamBanner.svg";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";
import { AutoAwesome, School, EmojiEvents } from "@mui/icons-material";

export default function CrackTest() {
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 28, color: "white" }} />,
      title: "Practice Tests",
      description: "Unlimited access to daily practice tests",
      color: "#4CAF50",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 28, color: "white" }} />,
      title: "Mock Tests",
      description: "Full-length exams with real pattern",
      color: "#2196F3",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 28, color: "white" }} />,
      title: "Learning Path",
      description: "Structured guidance for success",
      color: "#FF9800",
    },
  ];

  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      sx={{
        borderRadius: "24px",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        width: "100%",
        padding: { xs: "32px", md: "48px" },
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      width="100%"
      maxWidth="1200px"
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
        }}
      />

      <Stack sx={{ gap: "32px", width: { xs: "100%", md: "55%" }, zIndex: 1 }}>
        <Stack gap="16px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "28px", md: "36px" },
              fontWeight: "800",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            Crack GATE and other exams with our{" "}
            <span style={{ color: "#FFD700" }}>Premium</span> platform
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "16px", md: "18px" },
              color: "rgba(255,255,255,0.7)",
              maxWidth: "500px",
              lineHeight: 1.6,
            }}
          >
            Get a subscription and access unlimited exams, stream courses from
            our experienced faculties, and track your progress.
          </Typography>
        </Stack>

        <Stack direction="row" gap="16px" flexWrap="wrap">
          {features.map((item, index) => (
            <Stack
              key={index}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                p: "16px",
                width: { xs: "100%", sm: "160px" },
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  bgcolor: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  boxShadow: `0 4px 12px ${item.color}40`,
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "white",
                  mb: 0.5,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {item.description}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          onClick={handlePlansDialogOpen}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            color: "white",
            width: { xs: "100%", sm: "fit-content" },
            px: "40px",
            py: "12px",
            fontSize: "16px",
            fontWeight: "700",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(255, 152, 0, 0.3)",
            "&:hover": {
              backgroundColor: "#f57c00",
              transform: "scale(1.02)",
            },
          }}
        >
          Get Premium Access
        </Button>
      </Stack>

      <Stack
        sx={{
          width: { xs: "100%", md: "45%" },
          alignItems: "center",
          justifyContent: "center",
          display: { xs: "none", md: "flex" },
          zIndex: 1,
        }}
      >
        <Image
          src={crackExamBanner}
          alt="Exam Banner"
          width={450}
          height={450}
          style={{
            width: "100%",
            maxWidth: "450px",
            height: "auto",
            filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.3))",
          }}
        />
      </Stack>

      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </Stack>
  );
}
