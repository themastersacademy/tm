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
