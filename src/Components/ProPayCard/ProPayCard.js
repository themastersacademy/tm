"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, Stack, Typography, Skeleton } from "@mui/material";
import SubscriptionHeader from "./Components/SubscriptionHeader";
import PayCardCoupon from "../CheckoutPayCard/Components/PayCardCoupon";
import ProDurationCard from "./Components/ProDurationCard";
import ProPayCardTotalAmount from "./Components/ProTotalAmount";
import ProFloatingButton from "./Components/ProFloatingButton";
import { calculatePriceBreakdownWithCoupon } from "@/src/utils/pricing";

export default function ProPayCard({
  isDisabled,
  applyCoupon,
  removeCoupon,
  couponCode,
  setCouponCode,
  couponDetails,
  planIndex,
  plans,
  selectedPlan,
  setSelectedPlan,
  selectedPlanIndex,
  setSelectedPlanIndex,
  onClick,
}) {
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  useEffect(() => {
    if (plans.length > 0 && planIndex) {
      // Find the plan with the matching subscriptionPlanID
      const index = plans.findIndex((plan) => plan.id === planIndex);
      if (index !== -1) {
        setSelectedPlan(plans[index]);
        setSelectedPlanIndex(index);
      } else {
        // Fallback to the first plan if no match is found
        setSelectedPlan(plans[0]);
        setSelectedPlanIndex(0);
      }
    }
  }, [plans, planIndex, setSelectedPlan, setSelectedPlanIndex]);

  useEffect(() => {
    if (selectedPlan) {
      setPriceBreakdown(
        calculatePriceBreakdownWithCoupon(
          selectedPlan.priceWithTax || 0,
          selectedPlan.discountInPercent || 0,
          18,
          couponDetails
        )
      );
    }
  }, [selectedPlan, couponDetails]);

  const handlePlanChange = (index) => {
    setSelectedPlan(plans[index]);
    setSelectedPlanIndex(index);
  };

  return (
    <Stack sx={{ padding: "0px", width: "100%", margin: "0" }}>
      <Card
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "var(--white, #fff)",
          padding: "0px",
          width: { sm: "100%", lg: "350px", md: "350px", xs: "350px" },
          height: "auto",
          maxWidth: { xs: "100%" },
          alignSelf: "flex-end",
        }}
      >
        <CardContent>
          <Stack flexDirection={{ xs: "column", sm: "column", md: "column" }}>
            <Stack>
              <SubscriptionHeader />
            </Stack>
            <Stack>
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
                ></Stack>
                <Typography
                  sx={{
                    color: "var(--text4)",
                    fontSize: "12px",
                    marginTop: "10px",
                  }}
                >
                  Duration
                </Typography>

                <ProDurationCard
                  plans={plans}
                  selectedPlan={selectedPlan}
                  handlePlanChange={handlePlanChange}
                  planIndex={planIndex}
                  selectedPlanIndex={selectedPlanIndex}
                />
              </Stack>
              <hr
                style={{
                  border: "1px solid var(--border-color)",
                  marginTop: "10px",
                }}
              />
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
          <ProPayCardTotalAmount
            selectedPlan={selectedPlan}
            couponDetails={couponDetails}
            priceBreakdown={priceBreakdown}
          />
        </CardContent>
      </Card>
      <Stack
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "1000",
        }}
      >
        <ProFloatingButton
          selectedPlan={selectedPlan}
          couponDetails={couponDetails}
          isDisabled={isDisabled}
          onClick={onClick}
        />
      </Stack>
    </Stack>
  );
}