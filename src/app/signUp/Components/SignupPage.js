"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import mastersLogo from "@/public/images/masters-logo.svg";
import incrixLogo from "@/public/images/incrix-logo.svg";
import Form from "./Form";
import FormOTP from "./FormOTP";
import validatePassword from "@/src/utils/passwordValidator";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const { status } = useSession();
  const [validationError, setValidationError] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate password on change
  useEffect(() => {
    const error = password ? validatePassword(password).error : null;
    setValidationError(error);
  }, [password]);

  // Memoized error display helper
  const showError = useCallback((message) => {
    enqueueSnackbar(message, { variant: "error" });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  // Get OTP handler
  const handleGetOTP = useCallback(async () => {
    setIsLoading(true);

    // Field validation
    if (!email || !password || !confirmPassword) {
      return showError("Please fill all the fields");
    }
    if (password !== confirmPassword) {
      return showError("Passwords do not match");
    }
    if (validationError) {
      return showError(validationError);
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOTPSent(true);
      } else {
        showError(data.message || "Failed to send OTP");
      }
    } catch (error) {
      showError(error.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, validationError, showError]);

  // Verify OTP handler
  const handleVerifyOTP = useCallback(
    async (enteredOTP) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          body: JSON.stringify({ email, otp: enteredOTP || otp }),
        });
        const data = await res.json();
        if (data.success) {
          enqueueSnackbar("Account created successfully", {
            variant: "success",
          });
          router.push("/signIn");
        } else {
          showError(data.message || "Failed to verify OTP");
        }
      } catch (error) {
        showError(error.message || "Failed to verify OTP");
      } finally {
        setIsLoading(false);
      }
    },
    [email, otp, router, showError]
  );

  // Resend OTP handler
  const handleResendOTP = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOTPSent(true);
        enqueueSnackbar("OTP resent", { variant: "success" });
      } else {
        showError(data.message || "Failed to resend OTP");
        setIsOTPSent(false);
        setOtp("");
        setIsLoading(false);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setValidationError("");
      }
    } catch (error) {
      showError(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  }, [email, showError]);

  return (
    <Stack
      width={{ xs: "100%", md: "50%" }}
      height="100vh"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "var(--bg1)", position: "relative" }}
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
          Create your account
        </Typography>
        <Typography
          sx={{
            fontSize: "13px",
            color: "var(--text3)",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Sign up to start learning
        </Typography>

        {status === "loading" || status === "authenticated" ? (
          <CircularProgress sx={{ color: "var(--primary-color)" }} />
        ) : isOTPSent ? (
          <FormOTP
            otp={otp}
            setOtp={setOtp}
            handleVerifyOTP={handleVerifyOTP}
            isLoading={isLoading}
            handleResendOTP={handleResendOTP}
          />
        ) : (
          <Form
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleGetOTP={handleGetOTP}
            isLoading={isLoading}
            validationError={validationError}
          />
        )}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        gap="6px"
        sx={{ position: "absolute", bottom: 16 }}
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
