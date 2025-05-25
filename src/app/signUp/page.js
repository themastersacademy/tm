"use client";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import SignInBanner from "./Components/SignInBanner";
import SignupPage from "./Components/SignupPage";

export default function SignUp() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("900")); // Detects mobile screens (below 600px)

  return (
    <Stack flexDirection="row" sx={{ width: "100%" }}>
      <SignupPage isMobile={isMobile} />
      {!isMobile && <SignInBanner />}
    </Stack>
  );
}
