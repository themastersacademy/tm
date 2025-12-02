import { Box, Container, Stack, Typography } from "@mui/material";

export default function Partners() {
  return (
    <Box
      sx={{
        py: 6,
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
        bgcolor: "var(--white)",
      }}
    >
      <Container maxWidth="lg">
        <Stack gap={4} alignItems="center">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "14px",
              fontWeight: 700,
              color: "var(--text3)",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Trusted by Leading Organizations
          </Typography>
          <Stack
            direction="row"
            gap={{ xs: 4, md: 8 }}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            sx={{ opacity: 0.6 }}
          >
            {/* Placeholders for logos */}
            {["Google", "Microsoft", "Amazon", "Meta", "Netflix"].map(
              (partner, index) => (
                <Typography
                  key={index}
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "var(--text3)",
                  }}
                >
                  {partner}
                </Typography>
              )
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
