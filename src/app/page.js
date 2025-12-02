"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import PublicNavbar from "./Components/LandingPage/PublicNavbar";
import HeroLanding from "./Components/LandingPage/HeroLanding";
import Instructors from "./Components/LandingPage/Instructors";
import Testimonials from "./Components/LandingPage/Testimonials";
import Partners from "./Components/LandingPage/Partners";

// Reusing existing components
import HowDoes from "./dashboard/[goalID]/home/Components/HowDoes";
import InsightCard from "./dashboard/[goalID]/home/Components/InsightCard";
import CrackTest from "./dashboard/[goalID]/home/Components/CrackTest";
import FAQSect from "./dashboard/[goalID]/home/Components/FAQSect";

// Import icons for HowDoes
import enrollIcon from "@/public/images/enrollCourse.svg";
import learningIcon from "@/public/images/graduate.svg";
import certificateIcon from "@/public/images/achieve.svg";

// Placeholder icons if imports fail (we'll use generic ones for now to be safe)
const howItWorksData = [
  {
    title: "01. Enroll Course",
    description:
      "Choose from our wide range of structured courses and enroll to start your journey.",
    image: enrollIcon,
  },
  {
    title: "02. Start Learning",
    description:
      "Access high-quality video lectures, study materials, and practice tests anytime.",
    image: learningIcon,
  },
  {
    title: "03. Get Certified",
    description:
      "Complete the course, ace the exams, and earn a certificate to showcase your skills.",
    image: certificateIcon,
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "var(--white)", minHeight: "100vh" }}>
      <PublicNavbar />

      <main>
        <HeroLanding />

        <Box id="how-it-works" sx={{ py: 8, bgcolor: "var(--bg-color)" }}>
          <Container maxWidth="lg">
            <Stack gap={2} alignItems="center" textAlign="center" mb={6}>
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
                Process
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "32px", md: "40px" },
                  fontWeight: 800,
                  color: "var(--text1)",
                }}
              >
                Your Track To{" "}
                <span style={{ color: "var(--primary-color)" }}>Success</span>
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={4}
              justifyContent="center"
              alignItems="center"
            >
              {howItWorksData.map((item, index) => (
                <HowDoes
                  key={index}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              ))}
            </Stack>
          </Container>
        </Box>

        <Box id="features" sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <InsightCard />
          </Container>
        </Box>

        <Box id="instructors">
          <Instructors />
        </Box>

        <Box id="testimonials">
          <Testimonials />
        </Box>

        <Partners />

        <Box sx={{ py: 8 }}>
          <Container maxWidth="lg">
            <CrackTest />
          </Container>
        </Box>

        <Box sx={{ py: 8, bgcolor: "var(--bg-color)" }}>
          <FAQSect />
        </Box>
      </main>

      {/* Footer Placeholder - or reuse existing if available */}
      <Box
        sx={{ bgcolor: "#1a1a1a", color: "white", py: 6, textAlign: "center" }}
      >
        <Stack gap={2}>
          <Box
            sx={{
              fontWeight: 900,
              fontSize: "24px",
              color: "var(--primary-color)",
            }}
          >
            One Academy
          </Box>
          <Box sx={{ opacity: 0.7, fontSize: "14px" }}>
            © 2024 The Masters Academy. All rights reserved.
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
