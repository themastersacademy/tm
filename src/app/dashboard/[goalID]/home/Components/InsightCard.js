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
        borderRadius: "24px",
        backgroundColor: "var(--white)",
        minHeight: "330px",
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Stack
        sx={{
          padding: { xs: "32px", md: "48px" },
          width: { xs: "100%", md: "55%" },
          gap: "32px",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)",
        }}
      >
        <Stack gap="16px">
          <Stack direction="row" alignItems="center" gap={1}>
            <AutoAwesome sx={{ color: "var(--primary-color)", fontSize: 20 }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "14px",
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
              fontSize: { xs: "24px", md: "32px" },
              fontWeight: "800",
              lineHeight: 1.2,
              color: "var(--text1)",
            }}
          >
            Advanced Smart Test Engine for Real Exam Experience
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "16px", md: "18px" },
              lineHeight: "1.6",
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
          gap="20px"
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
              gap="12px"
            >
              <Box
                sx={{
                  bgcolor: "var(--sec-color-acc-1)",
                  borderRadius: "50%",
                  p: "4px",
                  display: "flex",
                }}
              >
                <CheckCircle
                  sx={{ color: "var(--primary-color)", fontSize: "16px" }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "15px",
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
