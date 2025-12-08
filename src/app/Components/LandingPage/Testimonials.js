import { Box, Container, Stack, Typography } from "@mui/material";
import { FormatQuote } from "@mui/icons-material";

const testimonials = [
  {
    text: "The structured courses and mock tests helped me crack GATE with a top rank. Highly recommended!",
    author: "Sarah L.",
    role: "GATE 2023 Topper",
  },
  {
    text: "The faculty is amazing. They explain complex concepts in such a simple way. Best learning platform!",
    author: "Mike R.",
    role: "Software Engineer",
  },
  {
    text: "I love the flexibility to learn at my own pace. The mobile app is super convenient for revision.",
    author: "Emily T.",
    role: "Student",
  },
];

export default function Testimonials() {
  return (
    <Box sx={{ py: 8, bgcolor: "var(--bg-color)" }}>
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
              Testimonials
            </Typography>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "32px", md: "40px" },
                fontWeight: 800,
                color: "var(--text1)",
              }}
            >
              Why people suggest to{" "}
              <span style={{ color: "var(--primary-color)" }}>
                learn our courses
              </span>
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={4}
            width="100%"
            justifyContent="center"
          >
            {testimonials.map((item, index) => (
              <Stack
                key={index}
                sx={{
                  width: { xs: "100%", md: "350px" },
                  p: 4,
                  borderRadius: "24px",
                  bgcolor: "var(--white)",
                  gap: 3,
                  position: "relative",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
                }}
              >
                <FormatQuote
                  sx={{
                    fontSize: 40,
                    color: "var(--primary-color)",
                    opacity: 0.2,
                    position: "absolute",
                    top: 20,
                    right: 20,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    lineHeight: 1.8,
                    color: "var(--text2)",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{item.text}&quot;
                </Typography>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      bgcolor: "var(--sec-color-acc-1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      color: "var(--primary-color)",
                    }}
                  >
                    {item.author[0]}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "var(--text1)",
                      }}
                    >
                      {item.author}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "12px",
                        color: "var(--text3)",
                      }}
                    >
                      {item.role}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
