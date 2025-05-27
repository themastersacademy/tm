import React from "react";
import { Stack, Card, CardContent, Typography, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { calculatePriceBreakdownWithCoupon } from "@/src/utils/pricing";
import PayCardHeader from "./Components/PayCardHeader";
import PayCardDuration from "./Components/PayCardDuration";
import PayCardTotalAmount from "./Components/PayCardTotalAmount";
import PayCardCoupon from "./Components/PayCardCoupon";
import FloatingBtn from "./Components/Floatingbtn";

export default function CheckoutPayCard({
  courseDetails,
  selectedPlan,
  handlePlanChange,
  couponDetails,
  applyCoupon,
  setCouponCode,
  couponCode,
  removeCoupon,
  isDisabled,
  onPaymentClick,
  loading,
  planIndex,
  setSelectedPlan,
}) {
  const [priceBreakdown, setPriceBreakdown] = useState(
    calculatePriceBreakdownWithCoupon(
      selectedPlan.priceWithTax,
      selectedPlan.discountInPercent,
      18,
      null
    )
  );

  useEffect(() => {
    if (courseDetails?.subscription?.plans && planIndex !== null) {
      const index = parseInt(planIndex, 10);
      if (
        !isNaN(index) &&
        index >= 0 &&
        index < courseDetails.subscription.plans.length
      ) {
        setSelectedPlan(courseDetails.subscription.plans[index]);
      } else {
        setSelectedPlan(courseDetails.subscription.plans[0]);
      }
    }
  }, [courseDetails, planIndex]);

  useEffect(() => {
    if (couponDetails) {
      setPriceBreakdown(
        calculatePriceBreakdownWithCoupon(
          selectedPlan.priceWithTax,
          selectedPlan.discountInPercent,
          18,
          couponDetails
        )
      );
    } else {
      setPriceBreakdown(
        calculatePriceBreakdownWithCoupon(
          selectedPlan.priceWithTax,
          selectedPlan.discountInPercent,
          18,
          null
        )
      );
    }
  }, [selectedPlan, couponDetails]);

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Stack
      sx={{ padding: "0px", Width: "500px", maxWidth: "100%", margin: "0 " }}
    >
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "var(--white, #fff)",
          padding: "0px",
          width: { sm: "100%", lg: "350px", md: "350px", xs: "350px" },
          height: "auto",
          maxWidth: { xs: "100%" },
        }}
      >
        <CardContent>
          {/* Card Header */}
          <Stack flexDirection={{ xs: "column", sm: "column", md: "column" }}>
            {/* Course Header Left side */}
            <Stack>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={250} />
              ) : (
                <PayCardHeader courseDetails={courseDetails} />
              )}
            </Stack>

            {/* Course Header Right side */}
            <Stack>
              {/* Duration */}
              <Stack>
                <Stack
                  sx={{
                    display: {
                      sm: "block",
                      md: "none",
                      xs: "none",
                      lg: "none",
                    },
                    marginTop: { sm: "15px", md: "0px" },
                  }}
                >
                  <Typography
                    sx={{ fontWeight: "bold", fontSize: { sm: "14px" } }}
                  >
                    {courseDetails?.title}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    color: "var(--text4)",
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  Duration
                </Typography>

                <PayCardDuration
                  selectedPlan={selectedPlan}
                  courseDetails={courseDetails}
                  handlePlanChange={handlePlanChange}
                  planIndex={planIndex}
                />
              </Stack>
              <hr
                style={{
                  border: "1px solid var(--border-color)",
                  marginTop: "10px",
                }}
              />

              {/* Coupon Code */}

              <Stack sx={{ paddingTop: "10px" }} gap="5px">
                <PayCardCoupon
                  couponDetails={couponDetails}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  applyCoupon={applyCoupon}
                  removeCoupon={removeCoupon}
                />
              </Stack>
              <hr
                style={{
                  border: "1px solid var(--border-color)",
                  marginTop: "10px",
                }}
              />
            </Stack>
          </Stack>

          {/* Total Amount */}
          <PayCardTotalAmount
            priceBreakdown={priceBreakdown}
            selectedPlan={selectedPlan}
            couponDetails={couponDetails}
          />
        </CardContent>
      </Card>

      <Stack
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: "60px",
          left: "0",
          right: "0",
          zIndex: "1000",
        }}
      >
        <FloatingBtn
          priceBreakdown={priceBreakdown}
          selectedPlan={selectedPlan}
          couponDetails={couponDetails}
          isDisabled={isDisabled}
          onPaymentClick={onPaymentClick}
          loading={loading}
        />
      </Stack>
    </Stack>
  );
}
