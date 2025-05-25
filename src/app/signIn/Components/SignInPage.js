"use client";
import { Stack, Typography } from "@mui/material";
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
    >
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Stack
          sx={{
            width: isMobile ? "80px" : "110px",
            height: isMobile ? "80px" : "110px",
            backgroundColor: "var(--border-color)",
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack
            sx={{
              width: isMobile ? "50px" : "70px",
              height: isMobile ? "50px" : "70px",
              backgroundColor: "var(--white)",
              borderRadius: "50px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src={mastersLogo}
              alt="logo"
              width={isMobile ? 32 : 48}
              height={isMobile ? 32 : 48}
            />
          </Stack>
        </Stack>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "600",
            color: "var(--text1)",
            marginTop: "15px",
            marginBottom: "35px",
          }}
        >
          Sign In to your account
        </Typography>
        <FormSignIn />
      </Stack>
      <Stack
        flexDirection={{ xs: "column", md: "row" }}
        width="100%"
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        sx={{ fontFamily: "Lato", padding: "20px" }}
      >
        <Stack>
          <Typography
            sx={{
              marginTop: "auto",
              marginRight: "auto",
              fontFamily: "Lato",
              fontSize: isMobile ? "12px" : "16px",
              fontWeight: "700",
              color: "var(--text4)",
              textAlign: "center",
            }}
          >
            ©2025 @ The Masters Academy
          </Typography>
        </Stack>
        <Stack flexDirection="row" alignItems="center" gap="10px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: isMobile ? "12px" : "16px",
              fontWeight: "700",
              color: "var(--text4)",
            }}
          >
            Designed By
          </Typography>
          <Image
            src={incrixLogo}
            alt="incrix"
            width={isMobile ? 52 : 104}
            height={isMobile ? 24 : 48}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
