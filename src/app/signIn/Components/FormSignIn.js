"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "notistack";

const FormSignIn = memo(() => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    errorMsg: "",
    isLoading: false,
    isGoogleLoading: false,
  });
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      if (
        !session.user.name ||
        (session.user.provider === "google" &&
          session.user.emailVerified === null)
      ) {
        router.push("/profile-setup");
      } else {
        router.push("/dashboard");
      }
    }
  }, [session, router]);

  // Show error snackbar when error message changes
  useEffect(() => {
    if (formState.errorMsg) {
      const snackbarAction = (key) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(key)}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      );

      enqueueSnackbar(formState.errorMsg, {
        variant: "error",
        autoHideDuration: 3000,
        action: snackbarAction,
      });
    }
  }, [formState.errorMsg, enqueueSnackbar, closeSnackbar]);

  // Use callbacks to prevent unnecessary re-renders
  const handleInputChange = useCallback(
    (field) => (e) => {
      setFormState((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleCredentialsLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateEmail(formState.email)) {
        setFormState((prev) => ({
          ...prev,
          errorMsg: "Please enter a valid email address",
        }));
        return;
      }

      setFormState((prev) => ({ ...prev, isLoading: true, errorMsg: "" }));

      const res = await signIn("credentials", {
        redirect: false,
        email: formState.email,
        password: formState.password,
      });

      if (res.error) {
        setFormState((prev) => ({
          ...prev,
          errorMsg: res.error,
          isLoading: false,
        }));
      } else {
        setFormState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [formState.email, formState.password]
  );

  const handleGoogleSignIn = useCallback(async () => {
    setFormState((prev) => ({ ...prev, isGoogleLoading: true }));
    await signIn("google");
  }, []);

  // Navigation helpers
  const navigateToSignUp = useCallback(() => router.push("/signUp"), [router]);

  if (status === "loading") {
    return <CircularProgress sx={{ color: "var(--primary-color)" }} />;
  }

  const { email, password, isLoading, isGoogleLoading } = formState;
  const isButtonDisabled = isLoading || isGoogleLoading || !email || !password;

  if (session) {
    return (
      <Stack alignItems="center" spacing={2}>
        {isLoading ? (
          <CircularProgress
            sx={{ color: "var(--primary-color)", fontSize: "40px" }}
          />
        ) : (
          <Typography>
            Already logged in as {session.user.name || session.user.email}
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: "100%",
        gap: "16px",
        justifyContent: "center",
        alignItems: "center",
      }}
      component="form"
      onSubmit={handleCredentialsLogin}
      noValidate
    >
      <Stack gap={0.5} width="100%">
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text2)",
            }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--primary-color)",
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={navigateToSignUp}
          >
            Create account
          </Typography>
        </Stack>
        <StyledTextField
          placeholder="Enter your email"
          sx={{ width: "100%" }}
          value={email}
          onChange={handleInputChange("email")}
          type="email"
          autoComplete="email"
        />
      </Stack>
      <Stack gap={0.5} width="100%">
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text2)",
          }}
        >
          Password
        </Typography>
        <StyledTextField
          placeholder="Enter your password"
          type="password"
          sx={{ width: "100%" }}
          value={password}
          onChange={handleInputChange("password")}
          autoComplete="current-password"
        />
        <Typography
          sx={{
            fontSize: "12px",
            color: "var(--primary-color)",
            cursor: "pointer",
            alignSelf: "flex-end",
            mt: 0.5,
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </Typography>
      </Stack>

      <Button
        variant="contained"
        type="submit"
        disabled={isButtonDisabled}
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          height: "36px",
          width: "100%",
          "&:disabled": {
            backgroundColor: "#e0e0e0",
          },
        }}
        disableElevation
        startIcon={
          isLoading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : null
        }
      >
        Sign In
      </Button>

      <Stack direction="row" alignItems="center" width="100%" spacing={1.5}>
        <Stack
          sx={{ height: "1px", bgcolor: "var(--border-color)", flex: 1 }}
        />
        <Typography sx={{ color: "var(--text4)", fontSize: "12px" }}>
          or
        </Typography>
        <Stack
          sx={{ height: "1px", bgcolor: "var(--border-color)", flex: 1 }}
        />
      </Stack>

      <Button
        variant="outlined"
        disabled={isLoading || isGoogleLoading}
        onClick={handleGoogleSignIn}
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          height: "36px",
          width: "100%",
          color: "var(--text1)",
          borderColor: "var(--border-color)",
          "&:hover": {
            borderColor: "var(--primary-color)",
            backgroundColor: "rgba(24, 113, 99, 0.04)",
          },
        }}
        startIcon={
          isGoogleLoading ? (
            <CircularProgress
              size={16}
              sx={{ color: "var(--primary-color)" }}
            />
          ) : (
            <GoogleIcon sx={{ fontSize: "18px" }} />
          )
        }
      >
        Continue with Google
      </Button>
    </Stack>
  );
});

FormSignIn.displayName = "FormSignIn";

export default FormSignIn;
