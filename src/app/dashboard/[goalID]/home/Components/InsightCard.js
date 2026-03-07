import { CheckCircle, AutoAwesome } from "@mui/icons-material";
import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import insight from "@/public/images/insight.svg";

export default function InsightCard() {
  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        width: "100%",
        overflow: "hidden",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
    >
      <Stack
        sx={{
          padding: { xs: "20px", md: "24px" },
          width: { xs: "100%", md: "55%" },
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <Stack gap="12px">
          <Stack direction="row" alignItems="center" gap={1}>
            <AutoAwesome sx={{ color: "var(--primary-color)", fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--primary-color)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Smart Engine
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "18px", md: "20px" },
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text1)",
            }}
          >
            Advanced Smart Test Engine for Real Exam Experience
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "13px",
              lineHeight: "1.5",
              color: "var(--text3)",
            }}
          >
            Practice in a real exam-like environment with section-wise timing,
            multiple question types, and instant feedback. Get detailed
            performance analysis to track progress.
          </Typography>
        </Stack>

        <Stack
          flexDirection={{ xs: "column", sm: "row" }}
          gap="16px"
          sx={{ marginTop: "auto" }}
        >
          {[
            "Multi-platform support",
            "Realtime secure environment",
            "Detailed Analytics",
          ].map((feature, index) => (
            <Stack
              key={index}
              flexDirection="row"
              alignItems="center"
              gap="8px"
            >
              <CheckCircle
                sx={{ color: "var(--primary-color)", fontSize: 16 }}
              />
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text2)",
                }}
              >
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack
        display={{ xs: "none", md: "flex" }}
        width="45%"
        alignItems="center"
        justifyContent="center"
        sx={{
          bgcolor: "var(--bg-color)",
          position: "relative",
        }}
      >
        <Image
          src={insight}
          alt="insight"
          style={{
            width: "90%",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Stack>
    </Stack>
  );
}
