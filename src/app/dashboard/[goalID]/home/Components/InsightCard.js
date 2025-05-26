import { CheckCircle } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
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
        minHeight: "330px",
        width: "100%",
        paddingTop: "45px",
      }}
    >
      <Stack
        sx={{
          padding: { xs: "0 15px 25px 15px", md: "0 0 25px 25px" },
          width: { xs: "100%", md: "50%" },
          gap: "25px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: { xs: "20px", md: "24px" },
            fontWeight: "600",
          }}
        >
          Advanced Smart Test Engine for Real Exam Experience and Performance
          Insights
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: { xs: "16px", md: "18px" },
            lineHeight: "32px",
            color: "var(--text4)",
          }}
        >
          Practice in a real exam-like environment with section-wise timing,
          multiple question types, and instant feedback. Get detailed
          performance analysis to track progress and improve effectively.
        </Typography>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          gap="10px"
          sx={{ marginTop: "auto" }}
        >
          <Stack flexDirection="row" alignItems="center" gap="10px">
            <CheckCircle sx={{ color: "var(--sec-color)" }} />
            <Typography sx={{ fontFamily: "Lato", fontSize: "16px" }}>
              Multi-platform support
            </Typography>
          </Stack>
          <Stack flexDirection="row" alignItems="center" gap="10px">
            <CheckCircle sx={{ color: "var(--sec-color)" }} />
            <Typography sx={{ fontFamily: "Lato", fontSize: "16px" }}>
              Realtime secure exam environment
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack display={{ xs: "none", md: "block" }}>
        <Image src={insight} alt="insight" width="100%" height="100%" />
      </Stack>
    </Stack>
  );
}
