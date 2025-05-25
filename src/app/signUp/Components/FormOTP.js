"use client";
import { useEffect, useRef, memo, useState, useCallback } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";

function FormOTP({ otp, setOtp, handleVerifyOTP, isLoading, handleResendOTP }) {
  const [resendOTPTime, setResendOTPTime] = useState(60);
  const timerRef = useRef(null);

  // Set up a countdown timer for the resend OTP button.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (resendOTPTime > 0) {
      timerRef.current = setInterval(() => {
        setResendOTPTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [resendOTPTime]);

  // Memoized callback to handle OTP completion.
  const handleComplete = useCallback(
    (value) => {
      setOtp(value);
      // Use setTimeout to allow state updates before verifying.
      setTimeout(() => {
        handleVerifyOTP(value);
      }, 0);
    },
    [setOtp, handleVerifyOTP]
  );

  // Memoized callback to handle OTP resend.
  const handleResend = useCallback(() => {
    handleResendOTP();
    setResendOTPTime(60);
  }, [handleResendOTP]);

  return (
    <Stack sx={{ width: "350px", gap: 2, justifyContent: "center" }}>
      <Stack gap={2}>
        <Typography sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: 500 }}>
          Enter OTP
        </Typography>
        <MuiOtpInput
          value={otp}
          onChange={setOtp}
          length={4}
          autoFocus
          onComplete={handleComplete}
          validateChar={(value) => !isNaN(Number(value))}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid var(--primary-color)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--primary-color)",
            },
          }}
        />
        <Stack flexDirection="row" alignItems="center">
          <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "var(--text4)" }}>
            Didn&apos;t receive the OTP?
          </Typography>
          {resendOTPTime > 0 ? (
            <Typography
              component="span"
              sx={{ color: "var(--sec-color)", fontSize: "14px", ml: 1 }}
            >
              Resend OTP in {resendOTPTime} seconds
            </Typography>
          ) : (
            <Button
              variant="text"
              onClick={handleResend}
              sx={{ color: "var(--sec-color)", textTransform: "none", ml: 1 }}
            >
              Resend OTP
            </Button>
          )}
        </Stack>
      </Stack>

      <Button
        variant="contained"
        onClick={() => handleVerifyOTP(otp)}
        disabled={isLoading || otp.length !== 4}
        disableElevation
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "100%",
        }}
      >
        Submit
      </Button>
    </Stack>
  );
}

export default memo(FormOTP);
