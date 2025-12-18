import { Button, Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import practiceTest from "@/public/images/practiceExam.svg";
import { AutoGraph, East } from "@mui/icons-material";

export default function ExamGroups({ handleOpen }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: { xs: "12px", md: "24px" },
        padding: { xs: "16px", md: "32px" },
        background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)",
        gap: { xs: "16px", md: "24px" },
        width: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Decorative Background Circle */}
      <Box
        sx={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.05)",
          zIndex: 0,
        }}
      />

      <Stack
        sx={{
          gap: { xs: "12px", md: "20px" },
          maxWidth: { xs: "100%", sm: "60%" },
          zIndex: 1,
          width: "100%",
        }}
      >
        <Stack gap={{ xs: "8px", md: "12px" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: { xs: "18px", md: "28px" },
              fontWeight: 800,
              color: "var(--text1)",
              lineHeight: 1.2,
            }}
          >
            Daily Practice Challenge
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: { xs: "13px", md: "16px" },
              color: "var(--text2)",
              lineHeight: 1.6,
            }}
          >
            Sharpen your skills with practice tests designed to boost accuracy,
            build confidence, and prepare you for real exam scenarios.
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" gap="12px">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              borderRadius: "20px",
            }}
          >
            <Box
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.2)",
              }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#15803D",
              }}
            >
              100+ Learners Active
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            width: "fit-content",
            padding: { xs: "8px 20px", md: "10px 24px" },
            borderRadius: "12px",
            fontFamily: "var(--font-geist-sans)",
            fontSize: { xs: "14px", md: "15px" },
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
            "&:hover": {
              backgroundColor: "var(--primary-color)",
              boxShadow: "0 6px 16px rgba(37, 99, 235, 0.3)",
              transform: "translateY(-1px)",
            },
          }}
          onClick={handleOpen}
          disableElevation
        >
          Start Practice
        </Button>
      </Stack>

      {/* Image - Hidden on mobile */}
      <Box
        sx={{
          position: "relative",
          width: { xs: "0", sm: "280px" },
          height: { xs: "0", sm: "220px" },
          display: { xs: "none", sm: "flex" },
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <Image
          src={practiceTest}
          alt="exam-group"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
          }}
        />
      </Box>
    </Stack>
  );
}
