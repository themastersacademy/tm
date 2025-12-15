import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function PublicNavbar() {
  return (
    <Box
      sx={{
        bgcolor: "var(--white)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: "70px" }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              {/* Use a text logo if image fails or just the name */}
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "var(--primary-color)",
                }}
              >
                One Academy
              </Typography>
            </Stack>
          </Link>

          {/* Links - Desktop */}
          <Stack
            direction="row"
            gap={4}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {["How it works", "Features", "Instructors", "Testimonials"].map(
              (item) => (
                <Typography
                  key={item}
                  component={Link}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text2)",
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": { color: "var(--primary-color)" },
                  }}
                >
                  {item}
                </Typography>
              )
            )}
          </Stack>

          {/* Auth Buttons */}
          <Stack direction="row" gap={2}>
            <Button
              component={Link}
              href="/signIn"
              variant="text"
              suppressHydrationWarning
              sx={{
                textTransform: "none",
                color: "var(--text1)",
                fontWeight: 700,
                "&:hover": { color: "var(--primary-color)" },
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/signUp"
              variant="contained"
              suppressHydrationWarning
              sx={{
                textTransform: "none",
                bgcolor: "var(--primary-color)",
                color: "white",
                borderRadius: "8px",
                px: 3,
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": { bgcolor: "var(--primary-color-dark)" },
              }}
            >
              Sign up
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
