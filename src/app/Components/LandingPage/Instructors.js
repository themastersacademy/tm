import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";

const instructors = [
  {
    name: "John Doe",
    role: "Mathematics Expert",
    image: null, // Placeholder
  },
  {
    name: "Jane Smith",
    role: "Physics Lead",
    image: null, // Placeholder
  },
  {
    name: "Robert Johnson",
    role: "Chemistry HOD",
    image: null, // Placeholder
  },
];

export default function Instructors() {
  return (
    <Box sx={{ py: 8, bgcolor: "var(--white)" }}>
      <Container maxWidth="lg">
        <Stack gap={6} alignItems="center">
          <Stack gap={2} alignItems="center" textAlign="center">
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
              Our Faculty
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "32px", md: "40px" },
                fontWeight: 800,
                color: "var(--text1)",
              }}
            >
              Guided by the Best to{" "}
              <span style={{ color: "var(--primary-color)" }}>
                Become the Best
              </span>
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={4}
            width="100%"
            justifyContent="center"
          >
            {instructors.map((instructor, index) => (
              <Stack
                key={index}
                sx={{
                  width: { xs: "100%", sm: "300px" },
                  p: 3,
                  borderRadius: "24px",
                  border: "1px solid var(--border-color)",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    borderColor: "var(--primary-color)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Placeholder for Instructor Image */}
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <Typography sx={{ fontSize: "40px" }}>👨‍🏫</Typography>
                  </Stack>
                </Box>
                <Stack alignItems="center" gap={0.5}>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--text1)",
                    }}
                  >
                    {instructor.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "var(--text3)",
                    }}
                  >
                    {instructor.role}
                  </Typography>
                </Stack>

                <Stack direction="row" gap={2} sx={{ mt: 1 }}>
                  <Facebook
                    sx={{
                      fontSize: 20,
                      color: "var(--text3)",
                      cursor: "pointer",
                      "&:hover": { color: "var(--primary-color)" },
                    }}
                  />
                  <Twitter
                    sx={{
                      fontSize: 20,
                      color: "var(--text3)",
                      cursor: "pointer",
                      "&:hover": { color: "var(--primary-color)" },
                    }}
                  />
                  <LinkedIn
                    sx={{
                      fontSize: 20,
                      color: "var(--text3)",
                      cursor: "pointer",
                      "&:hover": { color: "var(--primary-color)" },
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
