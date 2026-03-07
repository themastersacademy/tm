import { Button, Stack, Typography, Box } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
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
      icon: <School sx={{ fontSize: 20, color: "white" }} />,
      title: "Practice Tests",
      description: "Unlimited access to daily practice tests",
      color: "#4CAF50",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 20, color: "white" }} />,
      title: "Mock Tests",
      description: "Full-length exams with real pattern",
      color: "#2196F3",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 20, color: "white" }} />,
      title: "Learning Path",
      description: "Structured guidance for success",
      color: "#FF9800",
    },
  ];

  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      sx={{
        borderRadius: "10px",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        width: "100%",
        padding: { xs: "20px", md: "24px" },
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
      width="100%"
      maxWidth="1200px"
    >
      <Stack sx={{ gap: "20px", width: { xs: "100%", md: "55%" }, zIndex: 1 }}>
        <Stack gap="10px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "18px", md: "20px" },
              fontWeight: 700,
              color: "white",
              lineHeight: 1.3,
            }}
          >
            Crack GATE and other exams with our{" "}
            <span style={{ color: "#FFD700" }}>Premium</span> platform
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "500px",
              lineHeight: 1.5,
            }}
          >
            Get a subscription and access unlimited exams, stream courses from
            our experienced faculties, and track your progress.
          </Typography>
        </Stack>

        <Stack direction="row" gap="12px" flexWrap="wrap">
          {features.map((item, index) => (
            <Stack
              key={index}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                p: "12px",
                width: { xs: "100%", sm: "140px" },
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  bgcolor: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "white",
                  mb: 0.5,
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "11px",
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
            px: "24px",
            py: "8px",
            fontSize: "13px",
            fontWeight: 700,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#f57c00",
            },
            transition: "all 0.15s ease",
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
          width={400}
          height={400}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "auto",
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
