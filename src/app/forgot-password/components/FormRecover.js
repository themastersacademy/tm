"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { enqueueSnackbar } from "notistack";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import validatePassword from "@/src/utils/passwordValidator";

// Memoized sub-components for better performance
const GetOTP = memo(({ email, setEmail, handleGetOTP, isLoading }) => (
  <Stack gap={2}>
    <Stack flexDirection="row" justifyContent="space-between">
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "500" }}
      >
        Email
      </Typography>
      <Link href="/signUp">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "16px",
            fontWeight: "500",
            color: "var(--sec-color)",
            cursor: "pointer",
          }}
        >
          Create new account
        </Typography>
      </Link>
    </Stack>
    <StyledTextField
      placeholder="Enter your email"
      type="email"
      sx={{ width: "100%" }}
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <Stack flexDirection="row" gap="5px">
      <Typography sx={{ fontFamily: "Lato", fontSize: "16px" }}>
        Know password
      </Typography>
      <Link href="/signIn">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "16px",
            color: "var(--sec-color)",
          }}
        >
          Login
        </Typography>
      </Link>
    </Stack>
    <Button
      variant="contained"
      sx={{
        textTransform: "none",
        backgroundColor: "var(--primary-color)",
        borderRadius: "4px",
        fontFamily: "Lato",
        fontSize: "18px",
        height: "40px",
        width: "100%",
      }}
      disabled={isLoading}
      startIcon={
        isLoading ? <CircularProgress size={20} color="inherit" /> : null
      }
      disableElevation
      onClick={handleGetOTP}
    >
      Get OTP
    </Button>
  </Stack>
));

const VerifyOTP = memo(
  ({
    otp,
    setOtp,
    handleVerifyOTP,
    isLoading,
    email,
    handleResendOTP,
    resendOTPTime,
  }) => (
    <Stack gap={2}>
      <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
        Verify OTP
      </Typography>
      <Typography
        color="var(--sec-color)"
        sx={{ fontSize: "14px", fontWeight: "400" }}
      >
        Enter the OTP sent to {email} to verify your account
      </Typography>
      <MuiOtpInput
        value={otp}
        onChange={setOtp}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid var(--primary-color)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              border: "2px solid var(--primary-color)",
            },
        }}
        autoFocus
        onComplete={(value) => {
          console.log(value);
          // Use the complete value from the callback instead of the state
          setOtp(value);
          // Call handleVerifyOTP with the complete value
          setTimeout(() => handleVerifyOTP(value), 0);
        }}
        validateChar={(value) => !isNaN(Number(value))}
      />
      <Stack flexDirection="row" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            color: "var(--text4)",
          }}
        >
          Didn&apos;t receive the OTP?
          {resendOTPTime > 0 ? (
            <Typography
              component="span"
              sx={{
                color: "var(--sec-color)",
                fontSize: "14px",
                display: "inline-block",
                p: "8px",
              }}
            >
              Resend OTP in {resendOTPTime} seconds
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={handleResendOTP}
              sx={{ color: "var(--sec-color)", textTransform: "none" }}
            >
              Resend OTP
            </Button>
          )}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        onClick={handleVerifyOTP}
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "100%",
        }}
        disabled={isLoading || otp.length !== 4}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
        disableElevation
      >
        Verify OTP
      </Button>
    </Stack>
  )
);

const ChangePassword = memo(
  ({
    handleChangePassword,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    validationError,
  }) => (
    <Stack gap={2}>
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "500" }}
      >
        Update Password
      </Typography>
      <StyledTextField
        placeholder="Enter your new password"
        sx={{ width: "100%" }}
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <StyledTextField
        placeholder="Confirm your new password"
        sx={{ width: "100%" }}
        value={confirmPassword}
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        helperText={
          password !== confirmPassword ? "Passwords do not match" : ""
        }
        error={password !== confirmPassword}
      />
      {validationError && (
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: "400",
            color: "var(--delete-color)",
          }}
        >
          {validationError}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "100%",
        }}
        disabled={
          isLoading || password !== confirmPassword || !!validationError
        }
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
        disableElevation
        onClick={handleChangePassword}
      >
        Change Password
      </Button>
    </Stack>
  )
);

// Display names for better debugging
GetOTP.displayName = "GetOTP";
VerifyOTP.displayName = "VerifyOTP";
ChangePassword.displayName = "ChangePassword";

export default function FormRecover() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [formState, setFormState] = useState({
    token: searchParams.get("token"),
    otp: "",
    email: "",
    password: "",
    confirmPassword: "",
    isOTPSent: false,
    isVerified: false,
    isLoading: false,
    resendOTPTime: 60,
  });

  const {
    token,
    otp,
    email,
    password,
    confirmPassword,
    isOTPSent,
    isVerified,
    isLoading,
    resendOTPTime,
  } = formState;

  // Computed values
  const validationError = password ? validatePassword(password).error : null;

  // Update token from URL
  useEffect(() => {
    const newToken = searchParams.get("token");
    setFormState((prev) => ({
      ...prev,
      token: newToken,
      isVerified: !!newToken,
    }));
  }, [searchParams]);

  // OTP timer
  useEffect(() => {
    let timerId;
    if (resendOTPTime > 0) {
      timerId = setTimeout(
        () =>
          setFormState((prev) => ({
            ...prev,
            resendOTPTime: prev.resendOTPTime - 1,
          })),
        1000
      );
    }
    return () => clearTimeout(timerId);
  }, [resendOTPTime]);

  // Form state updaters
  const updateFormState = useCallback((updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setEmail = useCallback(
    (value) =>
      updateFormState({
        email: typeof value === "object" ? value.target.value : value,
      }),
    [updateFormState]
  );

  const setOtp = useCallback(
    (value) => updateFormState({ otp: value }),
    [updateFormState]
  );

  const setPassword = useCallback(
    (value) =>
      updateFormState({
        password: typeof value === "object" ? value.target.value : value,
      }),
    [updateFormState]
  );

  const setConfirmPassword = useCallback(
    (value) =>
      updateFormState({
        confirmPassword: typeof value === "object" ? value.target.value : value,
      }),
    [updateFormState]
  );

  // API handlers
  const handleGetOTP = useCallback(async () => {
    if (!email) {
      enqueueSnackbar("Email is required", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    updateFormState({ isLoading: true });

    try {
      const result = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await result.json();

      if (data.success) {
        updateFormState({ isOTPSent: true, resendOTPTime: 60 });
      } else {
        enqueueSnackbar(data.message, {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to send OTP", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      updateFormState({ isLoading: false });
    }
  }, [email, updateFormState]);

  const handleVerifyOTP = useCallback(
    async (otpValue) => {
      // Use the passed otpValue if provided, otherwise use the state value
      const otpToVerify = otpValue || otp;

      if (!otpToVerify) {
        enqueueSnackbar("OTP is required", {
          variant: "error",
          autoHideDuration: 3000,
        });
        return;
      }

      updateFormState({ isLoading: true });

      try {
        const result = await fetch("/api/auth/forgot-password/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpToVerify }),
        });

        const data = await result.json();

        if (data.success) {
          router.push(`/forgot-password?token=${data.data.token}`);
        } else {
          enqueueSnackbar(data.message || "Invalid OTP", {
            variant: "error",
            autoHideDuration: 3000,
          });
        }
      } catch (error) {
        enqueueSnackbar(error.message || "Failed to verify OTP", {
          variant: "error",
          autoHideDuration: 3000,
        });
      } finally {
        updateFormState({ isLoading: false });
      }
    },
    [email, otp, router, updateFormState]
  );

  const handleResendOTP = useCallback(async () => {
    updateFormState({ resendOTPTime: 60 });
    //Resend OTP has separate api call
    const result = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await result.json();
    if (data.success) {
      updateFormState({ isOTPSent: true, resendOTPTime: 60 });
    } else {
      enqueueSnackbar(data.message || "Failed to resend OTP", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  }, [email, updateFormState]);

  const handleChangePassword = useCallback(async () => {
    if (!password) {
      enqueueSnackbar("Password is required", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    if (validationError) {
      enqueueSnackbar(validationError, {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    updateFormState({ isLoading: true });

    try {
      const result = await fetch("/api/auth/forgot-password/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });

      const data = await result.json();

      if (data.success) {
        enqueueSnackbar("Password updated successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        router.push("/signIn");
      } else {
        enqueueSnackbar(data.message || "Failed to update password", {
          variant: "error",
          autoHideDuration: 3000,
        });

        if (data.message === "Time out") {
          updateFormState({
            isLoading: false,
            isVerified: false,
            isOTPSent: false,
            email: "",
            password: "",
            confirmPassword: "",
            otp: "",
            token: null,
          });
          router.replace("/forgot-password");
        }
      }
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to update password", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      updateFormState({ isLoading: false });
    }
  }, [
    password,
    confirmPassword,
    token,
    validationError,
    router,
    updateFormState,
  ]);

  // Render appropriate step
  return (
    <Stack
      sx={{
        width: "350px",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {!isOTPSent && !isVerified ? (
        <GetOTP
          email={email}
          setEmail={setEmail}
          handleGetOTP={handleGetOTP}
          isLoading={isLoading}
        />
      ) : isVerified ? (
        <ChangePassword
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
          handleChangePassword={handleChangePassword}
          validationError={validationError}
        />
      ) : (
        <VerifyOTP
          otp={otp}
          setOtp={setOtp}
          handleVerifyOTP={handleVerifyOTP}
          isLoading={isLoading}
          email={email}
          handleResendOTP={handleResendOTP}
          resendOTPTime={resendOTPTime}
        />
      )}
    </Stack>
  );
}
