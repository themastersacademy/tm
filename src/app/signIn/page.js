"use client";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import SignInPage from "./Components/SignInPage";
import SignInBanner from "../signUp/Components/SignInBanner";

export default function SignIn() {
  return (
    <Stack flexDirection="row" width="100%">
      <SignInPage />
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
