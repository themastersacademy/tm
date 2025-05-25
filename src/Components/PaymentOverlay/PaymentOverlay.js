// src/Components/PaymentLoadingOverlay.js
"use client";
import { Stack } from "@mui/material";
import paymentGif from "@/public/images/payment-gif.gif";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Script from "next/script";

export default function PaymentOverlay({
  order,
  priceDetails,
  transactionID,
  description,
  billingInfo,
  onClose,
}) {
  const router = useRouter();

  const onRazorpayLoad = async () => {
    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: priceDetails.totalPrice * 100,
        currency: "INR",
        name: process.env.NEXT_PUBLIC_COMPANY_NAME,
        description: description,
        order_id: order.id,
        handler: async function (response) {
          try {
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

            await verifyResponse.json();
          } catch (error) {
            enqueueSnackbar("Payment verification failed", {
              variant: "error",
            });
          } finally {
            onClose && onClose();
            router.push(`/dashboard/transaction/${transactionID}`);
          }
        },
        // prefill: {
        //   name: `${billingInfo?.firstName} ${billingInfo?.lastName}`,
        //   email: billingInfo?.email,
        //   contact: billingInfo?.phone,
        // },
        theme: {
          color: "#187163",
        },
        modal: {
          ondismiss: function () {
            onClose && onClose();
            enqueueSnackbar("Payment cancelled", { variant: "error" });
            router.push(`/dashboard/transaction/${transactionID}`);
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      enqueueSnackbar(error.message || "Payment initiation failed", {
        variant: "error",
      });
      onClose && onClose();
    }
  };

  return (
    <Stack
      position={"absolute"}
      top={0}
      left={0}
      width={"100vw"}
      height={"100%"}
      zIndex={1}
      backgroundColor={"white"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100%",
      }}
    >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={onRazorpayLoad}
      />
      <Stack>
        <img
          src={paymentGif.src}
          alt="Payment"
          style={{
            height: "auto",
            width: "auto",
            maxWidth: "950px",
            minWidth: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        {/* <Typography
          variant="h6"
          fontWeight={600}
          textAlign={"center"}
          color={"var(--text3)"}
          fontSize={"20px"}
        >
          Payment Processing
        </Typography> */}
      </Stack>
    </Stack>
  );
}
