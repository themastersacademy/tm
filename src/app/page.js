"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import PublicNavbar from "./Components/LandingPage/PublicNavbar";
import HeroLanding from "./Components/LandingPage/HeroLanding";
import JoinTeam from "./Components/LandingPage/JoinTeam";
import PromotionalBanner from "./Components/LandingPage/PromotionalBanner";
import FeaturesSection from "./Components/LandingPage/FeaturesSection";
import WhyChooseUs from "./Components/LandingPage/WhyChooseUs";
import AppDownload from "./Components/LandingPage/AppDownload";
import Instructors from "./Components/LandingPage/Instructors";
import Testimonials from "./Components/LandingPage/Testimonials";
import Partners from "./Components/LandingPage/Partners";

// Reusing existing components
import HowDoes from "./dashboard/[goalID]/home/Components/HowDoes";
import FAQSect from "./dashboard/[goalID]/home/Components/FAQSect";

// Import icons/images
import enrollIcon from "@/public/images/enrollCourse.svg";
import learningIcon from "@/public/images/graduate.svg";
import certificateIcon from "@/public/images/achieve.svg";

const howItWorksData = [
  {
    title: "01. Self-Check",
    description:
      "Assess your skills and identify areas for improvement before starting.",
    image: enrollIcon,
  },
  {
    title: "02. Taking Classes",
    description:
      "Attend interactive live classes and watch recorded video lessons.",
    image: learningIcon,
  },
  {
    title: "03. Take offline & online Test",
    description: "Practice with rigorous tests to ensure you are exam-ready.",
    image: certificateIcon,
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "var(--white)", minHeight: "100vh" }}>
      <PublicNavbar />

      <main>
        <HeroLanding />

        {/* Process Section */}
        <Box id="how-it-works" sx={{ py: 10, bgcolor: "var(--white)" }}>
          <Container maxWidth="lg">
            <Stack gap={2} alignItems="flex-start" mb={6}>
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
                How It Works - 3 Easy Steps
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "32px", md: "40px" },
                  fontWeight: 800,
                  color: "var(--text1)",
                }}
              >
                Your Track To Success
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={4}
              justifyContent="center"
              alignItems="stretch"
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

        <JoinTeam />

        <PromotionalBanner />

        <FeaturesSection />

        <WhyChooseUs />

        <Box id="testimonials">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "48px",
              fontWeight: 900,
              textAlign: "center",
              color: "rgba(0,0,0,0.05)",
              mb: -4,
              zIndex: 0,
              textTransform: "uppercase",
            }}
          >
            Success Stories
          </Typography>
          <Testimonials />
        </Box>

        <Box id="instructors" sx={{ py: 8 }}>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "32px",
              fontWeight: 800,
              textAlign: "center",
              mb: 4,
              color: "var(--text1)",
            }}
          >
            Guided by the Best to{" "}
            <span style={{ color: "var(--primary-color)" }}>
              Become the Best
            </span>
          </Typography>
          <Instructors />
        </Box>

        <Partners />

        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "24px",
              fontWeight: 700,
              mb: 1,
            }}
          >
            We&apos;ve got lots of friends.
          </Typography>
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "24px", fontWeight: 700 }}
          >
            and we&apos;re always{" "}
            <span style={{ color: "var(--primary-color)" }}>
              looking for more
            </span>
          </Typography>
        </Box>

        {/* Reusing Testimonials Component again as placeholder for "What our Users Say" section at bottom of design if needed, 
            but design shows "Success Stories" then Instructors then Partners. 
            The design ends with App Download and Footer. */}

        {/* <AppDownload /> */}

        <Box sx={{ py: 8, bgcolor: "var(--bg-color)" }}>
          <FAQSect />
        </Box>
      </main>

      {/* Footer Reuse */}
      <Box sx={{ bgcolor: "#222", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            gap={4}
          >
            <Stack gap={2} maxWidth="300px">
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "24px",
                  color: "var(--primary-color)",
                }}
              >
                One Academy
              </Typography>
              <Typography
                sx={{ opacity: 0.7, fontSize: "14px", lineHeight: 1.6 }}
              >
                Empowering students with knowledge and skills for a better
                future. Join us on this journey to success.
              </Typography>
            </Stack>

            <Stack gap={2}>
              <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>
                Quick Links
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                About Us
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                Courses
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                Instructors
              </Typography>
            </Stack>

            <Stack gap={2}>
              <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>
                Support
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                Help Center
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                Privacy Policy
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                Terms of Service
              </Typography>
            </Stack>

            <Stack gap={2}>
              <Typography sx={{ fontWeight: 700, fontSize: "18px" }}>
                Contact
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                +91 98765 43210
              </Typography>
              <Typography sx={{ opacity: 0.7, fontSize: "14px" }}>
                support@tma.com
              </Typography>
            </Stack>
          </Stack>
          <Box
            sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.1)", my: 4 }}
          />
          <Typography
            sx={{ textAlign: "center", opacity: 0.5, fontSize: "14px" }}
          >
            © 2025 The Masters Academy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
