"use client";
import { Box, Container, Stack, Typography } from "@mui/material";

const reasons = [
  {
    title: "Expert Instructors",
    description: "Learn from industry experts with verified profiles.",
    icon: "👨‍🏫",
  },
  {
    title: "Flexible Learning",
    description: "Study at your own pace, anytime, anywhere.",
    icon: "🕒",
  },
  {
    title: "Affordable Pricing",
    description: "High-quality education at prices you can afford.",
    icon: "💰",
  },
  {
    title: "Certification",
    description: "Earn recognized certificates upon completion.",
    icon: "📜",
  },
];

export default function WhyChooseUs() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "var(--white)" }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={6}
          justifyContent="space-between"
        >
          {/* Header */}
          <Stack gap={2} sx={{ width: { xs: "100%", md: "40%" } }}>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--primary-color)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Why Us
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "32px", md: "42px" },
                fontWeight: 900,
                color: "var(--text1)",
                lineHeight: 1.2,
              }}
            >
              Why people suggest to learn our courses...
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
                color: "var(--text3)",
                lineHeight: 1.6,
              }}
            >
              We focus on providing the best learning experience with features
              that matter most to students.
            </Typography>
          </Stack>

          {/* Grid of Reasons */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              width: { xs: "100%", md: "55%" },
            }}
          >
            {reasons.map((item, index) => (
              <Stack
                key={index}
                sx={{
                  p: 3,
                  bgcolor: "var(--bg-color)",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    bgcolor: "white",
                  },
                }}
                gap={2}
              >
                <Box
                  sx={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text1)",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    color: "var(--text3)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
