// "use client";

// import React, { useEffect } from "react";
// import { Stack, Typography, CircularProgress,} from "@mui/material";
// import { useRouter, useSearchParams } from "next/navigation";
// import { enqueueSnackbar } from "notistack";

// export default function Transaction() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // Helper to parse JSON safely
//   const safeJSONParse = (data, fallback) => {
//     try {
//       return JSON.parse(data);
//     } catch {
//       return fallback;
//     }
//   };

//   // Extract and parse query parameters
//   const courseDetails = safeJSONParse(searchParams.get("courseDetails"), null);
//   const selectedPlan = safeJSONParse(searchParams.get("selectedPlan"), null);
//   const couponCode = searchParams.get("couponCode") || "";
//   const selectedAddressIndex =
//     parseInt(searchParams.get("selectedAddressIndex")) ?? null;
//   const billingInfoList = safeJSONParse(
//     searchParams.get("billingInfoList"),
//     []
//   );
//   const selectedGoalId = searchParams.get("selectedGoalId") || null;

//   const courseEnroll = async () => {
//     if (
//       !courseDetails ||
//       !selectedPlan ||
//       selectedAddressIndex === null ||
//       !billingInfoList.length ||
//       !selectedGoalId
//     ) {
//       enqueueSnackbar("Missing required payment details", { variant: "error" });
//       router.push("/dashboard");
//       return;
//     }

//     const selectedPlanIndex = courseDetails?.subscription?.plans?.findIndex(
//       (plan) =>
//         plan.duration === selectedPlan.duration &&
//         plan.type === selectedPlan.type &&
//         plan.priceWithTax === selectedPlan.priceWithTax &&
//         plan.discountInPercent === selectedPlan.discountInPercent
//     );

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             courseID: courseDetails?.id,
//             goalID: selectedGoalId,
//             couponCode: couponCode || undefined,
//             subscriptionPlanIndex: selectedPlanIndex,
//             billingInfoIndex: selectedAddressIndex,
//           }),
//         }
//       );

//       const result = await response.json();
//       if (!result.success)
//         throw new Error(result.message || "Failed to initiate payment");

//       const { order, priceDetails } = result.data;

//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => {
//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: priceDetails.totalPrice * 100,
//           currency: "INR",
//           name: courseDetails.title,
//           description: `Payment for ${
//             selectedPlan.duration
//           } ${selectedPlan.type.toLowerCase()} plan`,
//           order_id: order.id,
//           handler: async function (response) {
//             try {
//               const verifyRes = await fetch(
//                 `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll/verify-payment`,
//                 {
//                   method: "POST",
//                   headers: { "Content-Type": "application/json" },
//                   body: JSON.stringify({
//                     razorpayOrderId: response.razorpay_order_id,
//                     razorpayPaymentId: response.razorpay_payment_id,
//                     razorpaySignature: response.razorpay_signature,
//                   }),
//                 }
//               );

//               const verifyResult = await verifyRes.json();
//               if (verifyResult.success) {
//                 enqueueSnackbar("Payment successful!", { variant: "success" });
//                 // setTimeout(() => {
//                 //   router.push("/dashboard");
//                 // }, 3000);
//               } else {
//                 enqueueSnackbar("Payment verification failed", {
//                   variant: "error",
//                 });
//                 // router.push("/dashboard");
//               }
//             } catch {
//               enqueueSnackbar("Payment failure", { variant: "error" });
//               //   router.push("/dashboard");
//             }
//           },
//           prefill: {
//             name: `${billingInfoList[selectedAddressIndex]?.firstName} ${billingInfoList[selectedAddressIndex]?.lastName}`,
//             email: billingInfoList[selectedAddressIndex]?.email,
//             contact: billingInfoList[selectedAddressIndex]?.phone,
//           },
//           theme: { color: "#187163" },
//           modal: {
//             ondismiss: () => {
//               enqueueSnackbar("Payment cancelled", { variant: "error" });
//               //   router.push("/dashboard");
//             },
//           },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.on("payment.failed", () => {
//           enqueueSnackbar("Payment failure", { variant: "error" });
//           //   router.push("/dashboard");
//         });
//         rzp.open();
//       };

//       script.onerror = () => {
//         throw new Error("Failed to load Razorpay SDK");
//       };

//       document.body.appendChild(script);
//     } catch (error) {
//       enqueueSnackbar(error.message || "Payment failure", { variant: "error" });
//       //   router.push("/dashboard");
//     }
//   };

//   useEffect(() => {
//     if (
//       courseDetails &&
//       selectedPlan &&
//       selectedAddressIndex !== null &&
//       billingInfoList.length &&
//       selectedGoalId
//     ) {
//       courseEnroll();
//     } else {
//       enqueueSnackbar("Invalid payment data", { variant: "error" });
//       router.push("/dashboard");
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <Stack
//       height="100vh"
//       justifyContent="center"
//       alignItems="center"
//       gap="20px"
//       bgcolor="#f5f5f5"
//     >
//       <CircularProgress sx={{ color: "#187163" }} />
//       <Typography variant="h6" fontWeight="bold" color="#187163">
//         Processing Your Payment...
//       </Typography>
//       <Typography variant="body2" color="textSecondary">
//         Please do not close this page or refresh.
//       </Typography>
//     </Stack>
//   );
// }
