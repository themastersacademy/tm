"use client";
import { Stack, Typography, Box } from "@mui/material";
import Image from "next/image";
import FormSignIn from "./FormSignIn";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";

export default function SignInPage({ isMobile }) {
  return (
    <Stack
      width={isMobile ? "100%" : "50%"}
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
          maxWidth: "450px",
          padding: isMobile ? "20px" : "40px",
          backgroundColor: isMobile ? "transparent" : "white",
          borderRadius: isMobile ? "0" : "16px",
          boxShadow: isMobile ? "none" : "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Stack
          sx={{
            width: isMobile ? "80px" : "100px",
            height: isMobile ? "80px" : "100px",
            backgroundColor: "var(--border-color)",
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Stack
            sx={{
              width: isMobile ? "50px" : "64px",
              height: isMobile ? "50px" : "64px",
              backgroundColor: "var(--white)",
              borderRadius: "50%",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src={mastersLogo}
              alt="logo"
              width={isMobile ? 32 : 40}
              height={isMobile ? 32 : 40}
            />
          </Stack>
        </Stack>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: isMobile ? "24px" : "28px",
            fontWeight: "700",
            color: "var(--text1)",
            marginBottom: "8px",
            textAlign: "center",
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "14px",
            color: "var(--text3)",
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          Sign in to access your dashboard
        </Typography>
        <FormSignIn />
      </Stack>

      <Stack
        flexDirection={{ xs: "column", md: "row" }}
        width="100%"
        justifyContent="center"
        alignItems="center"
        gap="8px"
        sx={{
          fontFamily: "Lato",
          padding: "20px",
          position: "absolute",
          bottom: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "500",
            color: "var(--text4)",
          }}
        >
          Powered by
        </Typography>
        <Image
          src={incrixLogo}
          alt="incrix"
          width={60}
          height={20}
          style={{ opacity: 0.7 }}
        />
      </Stack>
    </Stack>
  );
}
