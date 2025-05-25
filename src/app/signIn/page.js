"use client";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import SignInPage from "./Components/SignInPage";
import SignInBanner from "../signUp/Components/SignInBanner";

export default function SignIn() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("900")); // Detects mobile screens (below 600px)

  return (
    <Stack flexDirection="row" width="100%">
      <SignInPage isMobile={isMobile} />
      {!isMobile && <SignInBanner />}
    </Stack>
  );
}
