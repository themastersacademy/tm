"use client";
import { useCallback, memo } from "react";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import ContinueWithGoogle from "@/src/Components/ContinueWithGoogle/ContinueWithGoogle";

function Form({
  email,
  password,
  setEmail,
  setPassword,
  handleGetOTP,
  isLoading,
  validationError,
  setConfirmPassword,
  confirmPassword,
}) {
  const router = useRouter();

  // Memoize input handlers
  const handleEmailChange = useCallback(
    (e) => setEmail(e.target.value),
    [setEmail]
  );
  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    [setPassword]
  );
  const handleConfirmPasswordChange = useCallback(
    (e) => setConfirmPassword(e.target.value),
    [setConfirmPassword]
  );

  // Handle "Enter" key to trigger OTP fetch
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleGetOTP();
      }
    },
    [handleGetOTP]
  );

  // Determine if the Get OTP button should be disabled.
  const isButtonDisabled =
    isLoading ||
    Boolean(validationError) ||
    password !== confirmPassword ||
    !email ||
    !password ||
    !confirmPassword;

  return (
    <Stack
      sx={{
        width: { xs: "300px",sm:'350px', md: "350px" },
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Email Section */}
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: 500 }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--sec-color)",
              cursor: "pointer",
            }}
            onClick={() => router.push("/signIn")}
          >
            Login existing account
          </Typography>
        </Stack>
        <StyledTextField
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          sx={{ width: { xs: "300px", sm: "350px", md: "350px" } }}
        />
      </Stack>

      {/* Password Section */}
      <Stack gap={1} width="100%">
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: 500 }}
        >
          Password
        </Typography>
        <StyledTextField
          placeholder="Enter your new password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          sx={{ width: "100%" }}
        />
        <StyledTextField
          placeholder="Confirm your new password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onKeyDown={handleKeyDown}
          helperText={
            password !== confirmPassword ? "Passwords do not match" : ""
          }
          error={password !== confirmPassword}
          sx={{ width: "100%" }}
        />
        {validationError && (
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              fontWeight: 400,
              color: "var(--delete-color)",
            }}
          >
            {validationError}
          </Typography>
        )}
      </Stack>

      {/* Get OTP Button */}
      <Stack gap={1} width={{ xs: "300px", sm: "350px", md: "350px" }} alignItems="center">
        <Button
          variant="contained"
          onClick={handleGetOTP}
          disableElevation
          disabled={isButtonDisabled}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
          sx={{
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            borderRadius: "4px",
            fontFamily: "Lato",
            fontSize: "18px",
            height: "40px",
            width: { xs: "300px", sm: "350px", md: "350px" },
          }}
        >
          Get OTP
        </Button>
        <Typography color="var(--text4)">Or</Typography>
        <ContinueWithGoogle
          isButtonDisabled={isLoading}
          isLoading={isLoading}
        />
      </Stack>
    </Stack>
  );
}

export default memo(Form);
