import { Stack, Typography } from "@mui/material";

export default function ProPayCardTotalAmount({
  couponDetails,
  selectedPlan,
  priceBreakdown,
}) {
  if (!priceBreakdown) {
    return <Typography></Typography>;
  }
  return (
    <Stack>
      <Stack>
        <Stack
          sx={{ paddingTop: "10px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            Price
          </Typography>
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            ₹{priceBreakdown.actualPrice.toFixed(2)}
          </Typography>
        </Stack>

        <Stack
          sx={{ paddingTop: "10px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            Discount({selectedPlan.discountInPercent}%)
          </Typography>
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            ₹{priceBreakdown.planDiscount.toFixed(2)}
          </Typography>
        </Stack>
        {couponDetails && (
          <Stack
            sx={{ paddingTop: "10px" }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
              Coupon Discount
            </Typography>
            <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
              ₹{priceBreakdown.couponDiscount.toFixed(2)}
            </Typography>
          </Stack>
        )}

        <Stack
          sx={{ paddingTop: "10px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            Subtotal
          </Typography>
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            ₹
            {priceBreakdown.priceAfterCoupon
              ? priceBreakdown.priceAfterCoupon.toFixed(2)
              : priceBreakdown.priceAfterPlanDiscount.toFixed(2)}
          </Typography>
        </Stack>

        <Stack
          sx={{ paddingTop: "10px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            Tax (GST 18%)
          </Typography>
          <Typography sx={{ color: "var(--text4)", fontSize: "14px" }}>
            ₹{priceBreakdown.taxAmount.toFixed(2)}
          </Typography>
        </Stack>
        <Stack
          sx={{ paddingTop: "10px" }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            Total
          </Typography>
          <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
            ₹{priceBreakdown.totalPrice.toFixed(2)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
