"use client";
import {
  Stack,
  Typography,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";
import StyledTextField from "../../StyledTextField/StyledTextField";
import Confetti from "@/src/Components/ConfettiAnimationEffect/Confetti";
import { useState, useEffect, useRef } from "react";

export default function PayCardCoupon({
  couponDetails,
  couponCode,
  setCouponCode,
  applyCoupon,
  removeCoupon,
}) {
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const textFieldRef = useRef(null); // Create a ref for StyledTextField
  const [confettiOrigin, setConfettiOrigin] = useState(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  // Detect successful coupon application
  useEffect(() => {
    if (couponDetails) {
      // Calculate the position of the StyledTextField
      if (textFieldRef.current) {
        const rect = textFieldRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth; // Center of the text field (x)
        const y = (rect.top + rect.height / 2) / window.innerHeight; // Center of the text field (y)
        setConfettiOrigin({ x, y });
      }
      setConfettiTrigger(true);
      const timer = setTimeout(() => {
        setConfettiTrigger(false);
        setConfettiOrigin(null); // Reset origin after animation
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [couponDetails]);

  // Handle apply or remove coupon with loading state
  const handleCouponAction = async () => {
    setIsCouponLoading(true);
    try {
      if (couponDetails) {
        await removeCoupon();
      } else {
        await applyCoupon(couponCode);
      }
    } finally {
      setIsCouponLoading(false);
    }
  };

  return (
    <Stack>
      <Stack>
        <Typography
          sx={{ color: "var(--text4)", fontSize: { sm: "12px", md: "14px" } }}
        >
          Coupon
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ gap: "10px" }}>
          <StyledTextField
            inputRef={textFieldRef} // Attach ref to StyledTextField
            placeholder="Enter Coupon Code"
            variant="outlined"
            value={couponCode}
            disabled={couponDetails || isCouponLoading}
            onChange={(e) => setCouponCode(e.target.value)}
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
              backgroundColor: couponDetails
                ? "var(--delete-color)"
                : "var(--sec-color)",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
              width: "120px",
              height: "40px",
            }}
            onClick={handleCouponAction}
            disabled={isCouponLoading}
          >
            {isCouponLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : couponDetails ? (
              "Remove"
            ) : (
              "Apply"
            )}
          </Button>
        </Stack>
        {couponDetails && <CouponCard couponDetails={couponDetails} />}
        <Confetti trigger={confettiTrigger} origin={confettiOrigin} />
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
         applied
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
