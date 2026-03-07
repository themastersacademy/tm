import { Button, CircularProgress } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

export default function ContinueWithGoogle({
  isButtonDisabled,
  isGoogleLoading,
}) {
  return (
    <Button
      variant="outlined"
      disabled={isButtonDisabled}
      onClick={() => signIn("google")}
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
          <CircularProgress size={20} sx={{ color: "var(--primary-color)" }} />
        ) : (
          <GoogleIcon />
        )
      }
    >
      Continue with Google
    </Button>
  );
}
