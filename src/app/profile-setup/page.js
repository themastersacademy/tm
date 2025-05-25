"use client";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import SignInBanner from "../signUp/Components/SignInBanner";
import ProfileSetupPage from "./Components/ProfileSetupPage";
import { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function ProfileSetup() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("900")); // Detects mobile screens (below 600px)

  return (
    <Stack flexDirection="row" sx={{ width: "100%" }}>
      <Suspense
        fallback={<CircularProgress sx={{ color: "var(--primary-color)" }} />}
      >
        <ProfileSetupPage isMobile={isMobile} />
        {!isMobile && <SignInBanner />}
      </Suspense>
    </Stack>
  );
}
