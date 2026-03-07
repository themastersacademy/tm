"use client";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import FormSignIn from "./FormSignIn";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";

export default function SignInPage() {
  return (
    <Stack
      width={{ xs: "100%", md: "50%" }}
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: "var(--bg1)",
        position: "relative",
      }}
    >
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          padding: { xs: "20px", md: "32px" },
        }}
      >
        <Stack
          sx={{
            width: "48px",
            height: "48px",
            backgroundColor: "rgba(24, 113, 99, 0.08)",
            borderRadius: "10px",
            justifyContent: "center",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Image
            src={mastersLogo}
            alt="logo"
            width={28}
            height={28}
            style={{ width: "auto", height: "auto", maxWidth: "28px" }}
          />
        </Stack>
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text1)",
            marginBottom: "4px",
            textAlign: "center",
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            color: "var(--text3)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Sign in to access your dashboard
        </Typography>
        <FormSignIn />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{
          position: "absolute",
          bottom: 16,
        }}
      >
        <Typography
          suppressHydrationWarning
          sx={{ fontSize: "10px", fontWeight: 500, color: "var(--text4)" }}
        >
          Powered by
        </Typography>
        <Image
          suppressHydrationWarning
          src={incrixLogo}
          alt="incrix"
          width={50}
          height={16}
          style={{ opacity: 0.7 }}
        />
      </Stack>
    </Stack>
  );
}
