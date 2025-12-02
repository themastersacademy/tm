import {
  Box,
  Button,
  Container,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Search } from "@mui/icons-material";
import heroImage from "@/public/images/hero_landing.png";

export default function HeroLanding() {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "var(--bg-color)",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 4, md: 8 },
        pb: { xs: 6, md: 10 },
      }}
    >
      {/* Background Decor */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          bgcolor: "rgba(255, 152, 0, 0.05)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          gap={6}
        >
          {/* Text Content */}
          <Stack gap={4} sx={{ width: { xs: "100%", md: "50%" } }}>
            <Stack gap={2}>
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
                Start Your Journey
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: { xs: "40px", md: "56px" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: "var(--text1)",
                }}
              >
                One{" "}
                <span style={{ color: "var(--primary-color)" }}>Academy</span>
                <br />
                Thousands of
                <br />
                Success Stories.
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "18px",
                  color: "var(--text3)",
                  lineHeight: 1.6,
                  maxWidth: "500px",
                }}
              >
                Get unlimited access to structured courses, mock tests, and
                personalized guidance to crack your dream exam.
              </Typography>
            </Stack>

            {/* Search Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "white",
                borderRadius: "50px",
                p: "8px 8px 8px 24px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                maxWidth: "500px",
                border: "1px solid var(--border-color)",
              }}
            >
              <Search sx={{ color: "var(--text3)", mr: 1 }} />
              <InputBase
                placeholder="What do you want to learn?"
                sx={{ flex: 1, fontFamily: "Lato", fontSize: "16px" }}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: "50px",
                  textTransform: "none",
                  bgcolor: "var(--primary-color)",
                  px: 4,
                  py: 1.5,
                  fontSize: "16px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(255, 152, 0, 0.3)",
                }}
              >
                Search
              </Button>
            </Box>

            <Stack direction="row" gap={4} alignItems="center">
              <Stack direction="row" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#4CAF50",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  Live Classes
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "var(--primary-color)",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  Video Courses
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Hero Image */}
          <Stack
            sx={{ width: { xs: "100%", md: "45%" }, position: "relative" }}
          >
            <Box
              sx={{
                width: "100%",
                height: { xs: "300px", md: "500px" },
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={heroImage}
                alt="Hero Image"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
