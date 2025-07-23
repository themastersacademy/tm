"use client";
import { Stack } from "@mui/material";
import paymentGif from "@/public/images/payment-gif.gif";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Script from "next/script";
import Masters_logo from "@/public/images/masters-logo.svg";
import { useEffect, useState, useRef } from "react";

export default function PaymentOverlay({
  order,
  priceDetails,
  transactionID,
  description,
  billingInfo,
  onClose,
}) {
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(!!window.Razorpay);
  const [error, setError] = useState(null);
  const rzpRef = useRef(null);

  useEffect(() => {
    // console.log("useEffect triggered", {
    //   scriptLoaded,
    //   razorpayAvailable: !!window.Razorpay,
    //   orderId: order?.id,
    //   priceDetails,
    // });

    if (error) {
      console.log("Error occurred:", error);
      enqueueSnackbar(error, { variant: "error" });
      onClose && onClose();
      return;
    }

    // Validate props
    const amount =
      typeof priceDetails === "number"
        ? priceDetails
        : priceDetails?.totalPrice;
    if (!order?.id || !amount) {
      console.log("Invalid props", { order, priceDetails, amount });
      setError("Invalid order or price details");
      return;
    }

    // Initialize Razorpay if script is loaded and no instance exists
    if ((scriptLoaded || window.Razorpay) && !rzpRef.current) {
      // console.log("Initializing Razorpay with order:", order.id);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "YOUR_FALLBACK_KEY",
        amount: amount * 100, // Use validated amount
        currency: "INR",
        name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company",
        description: description,
        order_id: order.id,
        image: Masters_logo.src,
        handler: async function (response) {
          try {
            // console.log("Payment response:", response);
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();
            // console.log("Verification result:", verifyResult);

            if (verifyResult.success) {
              enqueueSnackbar("Payment successful!", { variant: "success" });
            } else {
              throw new Error(
                verifyResult.message || "Payment verification failed"
              );
            }
          } catch (err) {
            console.error("Verification error:", err);
            enqueueSnackbar(err.message || "Payment verification failed", {
              variant: "error",
            });
          } finally {
            onClose && onClose();
            router.push(`/dashboard/transaction/${transactionID}`);
            rzpRef.current = null;
          }
        },
        theme: {
          color: "#187163",
        },
        modal: {
          ondismiss: async function () {
            try {
              // console.log(
              //   "Modal dismissed, cancelling transaction:",
              //   transactionID
              // );
              const cancelResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll/cancel-transaction`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    transactionID,
                    razorpayOrderId: order.id,
                  }),
                }
              );

              const cancelResult = await cancelResponse.json();
              // console.log("Cancel result:", cancelResult);
              if (!cancelResult.success) {
                throw new Error(
                  cancelResult.message || "Failed to cancel transaction"
                );
              }
              enqueueSnackbar("Payment cancelled", { variant: "info" });
            } catch (err) {
              console.error("Cancel error:", err);
              enqueueSnackbar(err.message || "Failed to cancel transaction", {
                variant: "error",
              });
            } finally {
              onClose && onClose();
              router.push(`/dashboard/transaction/${transactionID}`);
              rzpRef.current = null;
            }
          },
        },
      };

      try {
        // console.log("Creating Razorpay instance");
        const rzp = new window.Razorpay(options);
        rzpRef.current = rzp;
        rzp.open();
      } catch (err) {
        console.error("Razorpay initialization error:", err);
        setError(err.message || "Payment initiation failed");
      }
    }
  }, [
    scriptLoaded,
    error,
    order,
    priceDetails,
    transactionID,
    description,
    billingInfo,
    onClose,
    router,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // console.log("Cleaning up PaymentOverlay");
      rzpRef.current = null;
    };
  }, []);

  return (
    <Stack
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100%"
      zIndex={1001}
      backgroundColor="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {!scriptLoaded && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => {
            console.log("Razorpay script loaded");
            setScriptLoaded(true);
          }}
          onError={(err) => {
            console.error("Razorpay script load error:", err);
            setError("Failed to load payment gateway");
          }}
        />
      )}
      <Stack display={{ xs: "none", sm: "block" }}>
        <img
          src={paymentGif.src}
          alt="Payment"
          style={{
            height: "auto",
            width: "auto",
            maxWidth: "950px",
            minWidth: "350px",
          }}
        />
      </Stack>
      <Stack display={{ xs: "block", sm: "none" }}>
        <img
          src={paymentGif.src}
          alt="Payment"
          style={{
            height: "auto",
            width: "auto",
            maxWidth: "600px",
            minWidth: "300px",
          }}
        />
      </Stack>
    </Stack>
  );
}
