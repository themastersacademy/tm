import { Stack, Typography, Button, Card } from "@mui/material";
import StyledTextField from "../../StyledTextField/StyledTextField";

export default function ProPayCardCoupon({
}) {
  return (
    <Stack>
      <Stack>
        <Typography sx={{ color: "var(--text4)", fontSize: {sm:'12px',md:'14px'} }}>
          Coupon
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ gap: "10px" }}>
          <StyledTextField
            placeholder="Enter Coupon Code"
            variant="outlined"
            // value={couponCode}
            // disabled={couponDetails}
            // onChange={(e) => setCouponCode(e.target.value)}
            sx={{
              width: "320px",
              height: "40px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#fff",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "var(--sec-color)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--sec-color)",
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              // backgroundColor: couponDetails
              //   ? "var(--delete-color)"
              //   : "var(--sec-color)",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              width: "120px",
              height: "40px",
            }}
            // onClick={() => {
            //   if (couponDetails) {
            //     removeCoupon();
            //   } else {
            //     applyCoupon(couponCode);
            //   }
            // }}
          >
            {/* {couponDetails ? "Remove" : "Apply"} */}
          </Button>
        </Stack>
        {/* {couponDetails && <CouponCard couponDetails={couponDetails} />} */}
      </Stack>
    </Stack>
  );
}

function CouponCard({ couponDetails }) {
  return (
    <Card
      sx={{
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "var(--sec-color-acc-2)",
        padding: "15px",
        marginTop: "10px",
        marginBottom: "10px",
        width: "100%",
        height: "auto",
        gap: "10px",
      }}
    >
      <Typography
        sx={{
          color: "var(--text3)",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        <font style={{ color: "var(--primary-color)" }}>
          {`"${couponDetails.code}"`}
        </font>
        &nbsp;applied
      </Typography>
      <Typography
        sx={{
          color: "var(--text3)",
          fontSize: "14px",
        }}
      >
        {`Get ${couponDetails.discountType === "FIXED" ? "₹" : ""}${
          couponDetails.discountValue
        } ${
          couponDetails.discountType === "PERCENTAGE" ? "%" : ""
        } off on your purchase ${
          couponDetails.minOrderAmount
            ? `above ₹${couponDetails.minOrderAmount}`
            : ""
        }. ${
          couponDetails.maxDiscountPrice
            ? `Max discount ₹${couponDetails.maxDiscountPrice}`
            : ""
        }`}
      </Typography>
    </Card>
  );
}
