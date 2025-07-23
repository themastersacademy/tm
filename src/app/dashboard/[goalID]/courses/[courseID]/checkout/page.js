"use client";
import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import CheckoutPayCard from "@/src/Components/CheckoutPayCard/CheckoutPayCard";
import { ArrowBackIos, CheckCircle } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import BillingInformation from "./Components/BillingInformation";
import PaymentButton from "./Components/PaymentButton";
import { useSession } from "next-auth/react";
import AddressCard from "./Components/AddressCard";
import { validateBasicBillingInfo } from "@/src/utils/validateBasicBillingInfo";
import PaymentLoadingOverlay from "@/src/Components/PaymentOverlay/PaymentOverlay";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";

export default function Checkout() {
  const params = useParams();
  const goalID = params.goalID;
  const courseID = params.courseID;
  const searchParams = useSearchParams();
  const planIndex = searchParams.get("plan");
  const { data: session } = useSession();
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [billingInfoList, setBillingInfoList] = useState([]);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const userType = session?.user?.accountType;

  const isPaidCourseForUser =
    (userType === "FREE" && !courseDetails?.subscription.isFree) ||
    (userType === "PRO" &&
      !courseDetails?.subscription.isFree &&
      !courseDetails?.subscription.isPro);

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const courseEnroll = async () => {
    const selectedPlanIndex = courseDetails?.subscription?.plans?.findIndex(
      (plan) =>
        plan.duration === selectedPlan.duration &&
        plan.type === selectedPlan.type &&
        plan.priceWithTax === selectedPlan.priceWithTax &&
        plan.discountInPercent === selectedPlan.discountInPercent
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: courseID,
            goalID: goalID,
            couponCode: couponCode || undefined,
            subscriptionPlanIndex: selectedPlanIndex,
            billingInfoIndex: selectedAddressIndex,
          }),
        }
      );

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to initiate payment");
      }
      setPaymentLoading(true);
      const { order, priceDetails, transactionID } = result.data;
      setPaymentInfo({ order, priceDetails, transactionID });
    } catch (error) {
      enqueueSnackbar(error.message || "Payment initiation failed", {
        variant: "error",
      });
    }
  };

  const fetchCourseDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseID: params.courseID,
          goalID: goalID,
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setCourseDetails(data.data);
      const index = parseInt(planIndex, 10);
      if (
        !isNaN(index) &&
        index >= 0 &&
        index < data.data.subscription.plans.length
      ) {
        setSelectedPlan(data.data.subscription.plans[index]);
      } else {
        setSelectedPlan(data.data.subscription.plans[0]);
      }
      setIsLoading(false);
    } else {
      console.error("Failed to fetch course details:", data.message);
    }
  }, [courseID, goalID, planIndex]);

  const applyCoupon = async (couponCode) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/coupon/${couponCode}`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    if (data.success) {
      setCouponDetails(data.data);
      enqueueSnackbar("Coupon applied successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(data.message, {
        variant: "error",
      });
    }
  };

  const removeCoupon = () => {
    setCouponDetails(null);
    setCouponCode("");
    enqueueSnackbar("Coupon removed", {
      variant: "success",
    });
  };

  const handlePlanChange = (index) => {
    console.log("index", index);
    setSelectedPlan(courseDetails?.subscription.plans[index]);
  };

  const fetchBillingInfo = useCallback(async () => {
    if (!session?.user?.id) {
      console.warn("User not authenticated, cannot fetch billing info");
      setBillingInfoList([]);
      return;
    }
    setIsLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/billing-info`;

      await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setBillingInfoList(data.data);
          } else if (Array.isArray(data)) {
            setBillingInfoList(data);
          } else {
            setBillingInfoList([]);
          }
          setIsLoading(false);
        });
    } catch (error) {
      setBillingInfoList([]);
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  }, [session?.user?.id]);

  const handlePinChange = async (e) => {
    const pin = e.target.value;
    setBillingInfo((prev) => ({ ...prev, pin }));

    if (pin.length === 6) {
      try {
        console.log("Fetching PIN:", pin);
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pin}`
        );
        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const city = data[0].PostOffice[0].Division;
          const state = data[0].PostOffice[0].State;

          setBillingInfo((prev) => ({
            ...prev,
            city,
            state,
            pin,
          }));
        } else {
          setBillingInfo((prev) => ({
            ...prev,
            city: "",
            state: "",
            pin,
          }));
        }
      } catch (error) {
        console.error("Error fetching PIN data:", error.message, error);
        setBillingInfo((prev) => ({
          ...prev,
          city: "",
          state: "",
          pin,
        }));
      }
    } else {
      setBillingInfo((prev) => ({
        ...prev,
        city: "",
        state: "",
        pin,
      }));
    }
  };

  const addBillingInfo = async (billingInfo) => {
    try {
      const updatedBillingInfo = { ...billingInfo, zip: billingInfo.pin };
      validateBasicBillingInfo(updatedBillingInfo);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/billing-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: session.user.id,
            billingInfo: updatedBillingInfo,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchBillingInfo();
            setShowBillingForm(false);
            setBillingInfo({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zip: "",
            });
            enqueueSnackbar("Address added", {
              variant: "success",
            });
          }
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  const updateBillingInfo = async (billingInfo, index) => {
    const billingInfoID = billingInfoList[index]?.id;
    if (!billingInfoID) {
      enqueueSnackbar("Billing info ID not found.", { variant: "error" });
      return;
    }

    try {
      if (!billingInfo.pin || !/^\d{5,6}$/.test(billingInfo.pin)) {
        enqueueSnackbar("A valid ZIP code (5-6 digits) is required.", {
          variant: "error",
        });
        return;
      }

      const updatedBillingInfo = { ...billingInfo, zip: billingInfo.pin };
      validateBasicBillingInfo(updatedBillingInfo);

      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/billing-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: session.user.id,
            billingInfoID: billingInfoID,
            billingInfo: updatedBillingInfo,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchBillingInfo();
            setShowBillingForm(false);
            setBillingInfo({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zip: "",
            });
            setEditIndex(null);
            enqueueSnackbar("Updated", {
              variant: "success",
            });
            return;
          }
          enqueueSnackbar(data.message, {
            variant: "error",
          });
        });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchCourseDetails();
    fetchBillingInfo();
  }, [goalID, params.courseID, fetchCourseDetails, fetchBillingInfo]);

  const editBillingInfo = (billingInfo, index) => {
    setBillingInfo({
      firstName: billingInfo.firstName || "",
      lastName: billingInfo.lastName || "",
      email: billingInfo.email || "",
      phone: billingInfo.phone || "",
      address: billingInfo.address || "",
      city: billingInfo.city || "",
      state: billingInfo.state || "",
      pin: billingInfo.zip || "",
    });
    setEditIndex(index);
    setShowBillingForm(true);
  };

  const deleteBillingInfo = async (index) => {
    const billingInfoID = billingInfoList[index]?.id;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/billing-info`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: session.user.id,
            billingInfoID: billingInfoID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setBillingInfoList((prev) => prev.filter((_, i) => i !== index));
        enqueueSnackbar("Deleted successfully", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(data.message || "Failed to delete", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Failed to delete: " + error.message, {
        variant: "error",
      });
    }
  };

  const handleEnroll = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/free-course-enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseID: courseID,
            goalID: goalID,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        router.push(`/dashboard/${goalID}/courses`);
        enqueueSnackbar("Enrolled", { variant: "success" });
      } else {
        enqueueSnackbar(data.message, { variant: "error" });
      }
    } catch (err) {
      console.error("Error in enroll");
    }
  };

  return (
    <Stack>
      {paymentLoading && (
        <PaymentLoadingOverlay
          {...paymentInfo}
          setPaymentLoading={setPaymentLoading}
          description={`Payment for ${courseDetails?.title}`}
          billingInfo={billingInfoList[selectedAddressIndex]}
        />
      )}
      <Stack
        padding={{ xs: "10px", sm: "30px" }}
        alignItems="center"
        marginBottom={{ xs: "250px", sm: "250px", lg: "20px" }}
      >
        {isLoading ? (
          <PageSkeleton />
        ) : (
          <Stack gap="20px" width="100%" maxWidth="1200px">
            <Stack
              sx={{
                width: "100%",
                alignItems: "center",
                flexDirection: "row",
                border: "1px solid var(--border-color)",
                borderRadius: "10px",
                backgroundColor: "var(--white)",
                padding: "20px",
                height: "60px",
              }}
            >
              <ArrowBackIos
                onClick={() => router.back()}
                sx={{ cursor: "pointer", fontSize: "20px" }}
              />
              <Typography
                sx={{ fontSize: "20px", fontFamily: "Lato", fontWeight: "700" }}
              >
                Checkout
              </Typography>
            </Stack>
            <Stack
              direction={{ xs: "column", lg: "row", md: "row" }}
              gap={{ xs: "20px", lg: "30px" }}
              width="100%"
            >
              <Stack
                flex={{ xs: "auto", lg: 0.6 }}
                gap={{ xs: "20px", lg: "30px" }}
              >
                {isPaidCourseForUser ? (
                  <Stack>
                    {billingInfoList
                      .filter((info) => info && info.firstName)
                      .map((info, index) => (
                        <AddressCard
                          key={index}
                          billingInfo={info}
                          title={`Billing Address ${index + 1}`}
                          onEdit={editBillingInfo}
                          index={index}
                          onDelete={deleteBillingInfo}
                          isSelected={selectedAddressIndex === index}
                          onSelect={() => handleAddressSelect(index)}
                        />
                      ))}
                  </Stack>
                ) : (
                  <Stack
                    sx={{
                      border: "1px solid var(--border-color)",
                      borderRadius: 2,
                      p: 2.5,
                      bgcolor: "var(--white)",
                      gap: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: "Lato",
                        color: "var(--text1)",
                      }}
                    >
                      Enroll for Free
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        fontFamily: "Lato",
                        color: "var(--text2)",
                      }}
                    >
                      This course is completely free of cost. You’ll get full
                      access to all lessons and materials after enrollment.
                    </Typography>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <CheckCircle sx={{ fontSize: 20, color: "green" }} />
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontFamily: "Lato",
                          color: "var(--text1)",
                        }}
                      >
                        100% Free – No card required for Enroll
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <CheckCircle sx={{ fontSize: 20, color: "green" }} />
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontFamily: "Lato",
                          color: "var(--text1)",
                        }}
                      >
                        Unlock resources for free by Enroll
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <CheckCircle sx={{ fontSize: 20, color: "green" }} />
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontFamily: "Lato",
                          color: "var(--text1)",
                        }}
                      >
                        Get 1 Year Free Access for Enroll
                      </Typography>
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={handleEnroll}
                      sx={{
                        backgroundColor: "var(--sec-color)",
                        color: "var(--white)",
                        fontSize: "16px",
                        fontFamily: "Lato",
                        fontWeight: "700",
                        textTransform: "none",
                        width: "100%",
                      }}
                    >
                      Enroll Now for Free
                    </Button>
                  </Stack>
                )}
                {isPaidCourseForUser ? (
                  <BillingInformation
                    billingInfo={billingInfo}
                    setBillingInfo={setBillingInfo}
                    handlePinChange={handlePinChange}
                    addBillingInfo={addBillingInfo}
                    showBillingForm={showBillingForm}
                    setShowBillingForm={setShowBillingForm}
                    updateBillingInfo={updateBillingInfo}
                    editIndex={editIndex}
                  />
                ) : (
                  ""
                )}
                <Stack
                  marginTop="0px"
                  width="100%"
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  {isPaidCourseForUser ? (
                    <PaymentButton
                      isDisabled={selectedAddressIndex === null}
                      onPaymentClick={courseEnroll}
                      loading={paymentLoading}
                      isFree={courseDetails?.subscription?.isFree}
                    />
                  ) : (
                    ""
                  )}
                </Stack>
              </Stack>
              {isPaidCourseForUser ? (
                <Stack
                  flex={{ xs: "auto", lg: 0.4 }}
                  gap="20px"
                  alignItems={{ xs: "center", lg: "flex-end" }}
                >
                  <CheckoutPayCard
                    courseDetails={courseDetails}
                    selectedPlan={selectedPlan}
                    handlePlanChange={handlePlanChange}
                    couponDetails={couponDetails}
                    applyCoupon={applyCoupon}
                    setCouponCode={setCouponCode}
                    couponCode={couponCode}
                    removeCoupon={removeCoupon}
                    isDisabled={selectedAddressIndex === null}
                    onPaymentClick={courseEnroll}
                    loading={paymentLoading}
                    planIndex={planIndex}
                    setSelectedPlan={setSelectedPlan}
                  />
                </Stack>
              ) : (
                ""
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
