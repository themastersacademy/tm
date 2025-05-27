import {
  Stack,
  Button,
  Typography,
  Skeleton,
  CircularProgress,
} from "@mui/material";

export default function FloatingBtn({
  priceBreakdown,
  isDisabled,
  onPaymentClick,
  loading,
}) {
  return (
    <Stack
      sx={{
        backgroundColor: "var(--white)",
        padding: "20px",
      }}
    >
      <Stack>
        <Stack flexDirection="row" gap="10px" justifyContent="space-between">
          <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
            Total:
          </Typography>
          {priceBreakdown?.totalPrice ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Pay: ₹{priceBreakdown.totalPrice.toFixed(2)}
            </Typography>
          ) : (
            <Skeleton variant="text" width={100} />
          )}
        </Stack>
        <Stack>
          <Typography sx={{ fontSize: "12px" }}>
            By completing your purchases, you agreed to this{" "}
            <span style={{ color: "var(--primary-color)" }}>Terms of use</span>.
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={isDisabled}
          onClick={onPaymentClick}
          sx={{
            backgroundColor: isDisabled
              ? "var(--sec-color)"
              : "var(--sec-color)",
            color: "var(--white)",
            fontSize: "16px",
            fontFamily: "Lato",
            fontWeight: "700",
            padding: "10px 20px",
            borderRadius: "10px",
            textTransform: "none",
            width: { xs: "240px", sm: "300px" },
            "&:hover": {
              backgroundColor: isDisabled
                ? "var(--sec-color)"
                : "var(--sec-color)",
            },
          }}
        >
          {loading ? (
            <CircularProgress
              sx={{ color: "var(--primary-color)" }}
              size={24}
            />
          ) : (
            "Proceed to Pay"
          )}
        </Button>
      </Stack>
    </Stack>
  );
}
