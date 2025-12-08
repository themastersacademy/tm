import { Stack, Button, CircularProgress, Typography } from "@mui/material";
import { Lock, ArrowForward } from "@mui/icons-material";

export default function PaymentButton({
  isDisabled,
  onPaymentClick,
  loading,
  isFree,
}) {
  return (
    <Stack width="100%">
      <Button
        variant="contained"
        disabled={isDisabled || loading}
        onClick={onPaymentClick}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isFree ? (
            <ArrowForward />
          ) : (
            <Lock />
          )
        }
        sx={{
          bgcolor: "var(--primary-color)",
          color: "var(--white)",
          fontSize: "16px",
          fontFamily: "Lato",
          fontWeight: "700",
          padding: "12px 24px",
          borderRadius: "100px",
          textTransform: "none",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "var(--primary-color-dark)",
            transform: "translateY(-2px)",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
          },
          "&.Mui-disabled": {
            bgcolor: "var(--border-color)",
            color: "var(--text4)",
            boxShadow: "none",
            transform: "none",
          },
          width: "100%",
        }}
      >
        {loading ? (
          <Typography sx={{ ml: 1, fontWeight: 600 }}>Processing...</Typography>
        ) : isFree ? (
          "Enroll Now"
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </Stack>
  );
}
