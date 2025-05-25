import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import SignInBanner from "../signUp/Components/SignInBanner";
import FormRecover from "./components/FormRecover";
import { Suspense } from "react";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";
export default function ForgotPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Stack flexDirection="row" width="100%">
        <Stack
          width="50%"
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
                width: "110px",
                height: "110px",
                backgroundColor: "var(--border-color)",
                borderRadius: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack
                sx={{
                  width: "70px",
                  height: "70px",
                  backgroundColor: "var(--white)",
                  borderRadius: "50px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={mastersLogo}
                  alt="logo"
                  width={48}
                  height={48}
                />
              </Stack>
            </Stack>
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--text1)",
                marginTop: "15px",
                marginBottom: "35px",
              }}
            >
              Reset your password
            </Typography>
            <FormRecover />
          </Stack>
          <Stack
            flexDirection="row"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            sx={{ fontFamily: "Lato", padding: "20px" }}
          >
            <Typography
              sx={{
                marginTop: "auto",
                marginRight: "auto",
                fontFamily: "Lato",
                fontSize: "16px",
                fontWeight: "700",
                color: "var(--text4)",
              }}
            >
              ©2025 @ The Masters Academy
            </Typography>
            <Stack flexDirection="row" alignItems="flex-end" gap="10px">
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "var(--text4)",
                }}
              >
                Designed By
              </Typography>
              <Image
                src={incrixLogo}
                alt="incrix"
                width={104}
                height={24}
              />
            </Stack>
          </Stack>
        </Stack>
        <SignInBanner />
      </Stack>
    </Suspense>
  );
}
