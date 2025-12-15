"use client";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import SignInBanner from "./Components/SignInBanner";
import SignupPage from "./Components/SignupPage";

export default function SignUp() {
  return (
    <Stack flexDirection="row" sx={{ width: "100%" }}>
      <SignupPage />
      <Stack
        sx={{
          display: { xs: "none", md: "flex" },
          width: "50%",
        }}
      >
        <SignInBanner />
      </Stack>
    </Stack>
  );
}
