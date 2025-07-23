import { Stack, Button, CircularProgress } from "@mui/material";

export default function PaymentButton({
  isDisabled,
  onPaymentClick,
  loading,
  isFree,
}) {
  return (
    <Stack>
      <Button
        variant="contained"
        disabled={isDisabled || loading}
        onClick={onPaymentClick}
        sx={{
          backgroundColor:
            isDisabled || loading ? "var(--sec-color)" : "var(--sec-color)",
          color: "var(--white)",
          fontSize: "16px",
          fontFamily: "Lato",
          fontWeight: "700",
          padding: "10px 20px",
          borderRadius: "5px",
          textTransform: "none",
          "&:hover": {
            backgroundColor:
              isDisabled || loading ? "var(--sec-color)" : "var(--sec-color)",
          },
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: "var(--primary-color)" }} size={24} />
        ) : isFree ? (
          "Enroll"
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </Stack>
  );
}
