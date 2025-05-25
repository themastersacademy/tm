"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
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

  useEffect(() => {
    console.log("session", session);
  }, [session]);

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

  const handleCredentialsLogin = useCallback(
    async (e) => {
      e.preventDefault();
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
        // router.push("/dashboard");
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
  const isButtonDisabled = isLoading || isGoogleLoading;

  if (session) {
    return (
      <Stack alignItems="center" spacing={2}>
        <Typography>
          Already logged in as {session.user.name || session.user.email}
        </Typography>
        <Button variant="contained" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
        <Button variant="contained" onClick={() => signOut()}>
          Sign Out
        </Button>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        width: { xs: "300px", sm: "350px", md: "350px" },
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
      component="form"
      onSubmit={handleCredentialsLogin}
      noValidate
    >
      <Stack gap={1} width="100%">
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Email
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "16px",
              fontWeight: "500",
              color: "var(--sec-color)",
              cursor: "pointer",
            }}
            onClick={navigateToSignUp}
          >
            Create new account
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
      <Stack gap={1} width="100%">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "16px",
            fontWeight: "500",
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
            fontFamily: "Lato",
            fontSize: "16px",
            color: "var(--sec-color)",
            cursor: "pointer",
          }}
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password
        </Typography>
      </Stack>

      <Button
        variant="contained"
        type="submit"
        disabled={isButtonDisabled || !email || !password}
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "100%",
        }}
        disableElevation
        startIcon={
          isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : null
        }
      >
        Continue
      </Button>

      <Typography color="var(--text4)">Or</Typography>

      <Button
        variant="outlined"
        disabled={isButtonDisabled}
        onClick={handleGoogleSignIn}
        sx={{
          textTransform: "none",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "100%",
          color: "var(--primary-color)",
          borderColor: "var(--primary-color)",
        }}
        startIcon={
          isGoogleLoading ? (
            <CircularProgress
              size={20}
              sx={{ color: "var(--primary-color)" }}
            />
          ) : (
            <GoogleIcon />
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
