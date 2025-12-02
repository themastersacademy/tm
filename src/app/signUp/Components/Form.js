"use client";
import { useCallback, memo, useState } from "react";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ContinueWithGoogle from "@/src/Components/ContinueWithGoogle/ContinueWithGoogle";
import PolicyDialog from "./PolicyDialog";
import { termsContent, privacyContent, refundContent } from "./policyContent";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

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

  const handleCheckboxChange = useCallback((e) => {
    setAgreedToTerms(e.target.checked);
  }, []);

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
    !confirmPassword ||
    !agreedToTerms;

  return (
    <Stack
      sx={{
        width: { xs: "300px", sm: "350px", md: "350px" },
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

      <FormControlLabel
        control={
          <Checkbox
            checked={agreedToTerms}
            onChange={handleCheckboxChange}
            sx={{
              color: "var(--primary-color)",
              "&.Mui-checked": {
                color: "var(--primary-color)",
              },
            }}
          />
        }
        label={
          <Typography
            sx={{ fontSize: "12px", color: "var(--text3)", fontFamily: "Lato" }}
          >
            I agree to the{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setActivePolicy("terms")}
              sx={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Terms & Conditions
            </Link>
            ,{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setActivePolicy("privacy")}
              sx={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Data Privacy
            </Link>{" "}
            and{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setActivePolicy("refund")}
              sx={{
                color: "var(--primary-color)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              No Refund Policy
            </Link>
          </Typography>
        }
        sx={{ width: "100%", alignItems: "flex-start", ml: 0 }}
      />

      {/* Get OTP Button */}
      <Stack
        gap={1}
        width={{ xs: "300px", sm: "350px", md: "350px" }}
        alignItems="center"
      >
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
          isButtonDisabled={isLoading || !agreedToTerms}
          isLoading={isLoading}
        />
      </Stack>

      {/* Policy Dialogs */}
      <PolicyDialog
        open={activePolicy === "terms"}
        onClose={() => setActivePolicy(null)}
        title="Terms & Conditions"
        content={termsContent}
      />
      <PolicyDialog
        open={activePolicy === "privacy"}
        onClose={() => setActivePolicy(null)}
        title="Data Privacy Policy"
        content={privacyContent}
      />
      <PolicyDialog
        open={activePolicy === "refund"}
        onClose={() => setActivePolicy(null)}
        title="No Refund Policy"
        content={refundContent}
      />
    </Stack>
  );
}

export default memo(Form);
