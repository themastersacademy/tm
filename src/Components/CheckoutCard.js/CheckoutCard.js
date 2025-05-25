"use client";
import { East } from "@mui/icons-material";
import { Button, Stack, Typography, Select, MenuItem } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import { useRouter, useParams } from "next/navigation";
import FloatingCheckoutCard from "./Components/FloatingCheckoutCard";

export default function CheckoutCard({ courseDetails }) {
  const [loading, setLoading] = useState(false);
  const plans = courseDetails?.subscription?.plans || [];
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { goalID, courseID } = params;
  // Set default plan when plans are available
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan]);

  // Handle plan selection
  const handlePlanChange = (event) => {
    const selectedDuration = event.target.value;
    const selected = plans.find((plan) => plan.duration === selectedDuration);
    // console.log("Selected Duration:", selectedDuration, "Found Plan:", selected); // Debug
    if (selected) {
      setSelectedPlan(selected);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountInPercent) => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountInPercent);
    if (isNaN(price) || isNaN(discount) || discount < 0 || discount >= 100) {
      return 0;
    }
    const discountedPrice = price * (1 - discount / 100);
    return Math.round(discountedPrice);
  };

  // Format plan label based on type
  const formatPlanLabel = (plan) => {
    const duration = parseInt(plan.duration, 10);
    const plural = duration > 1 ? "s" : "";
    if (plan.type === "YEARLY") {
      return `${duration} Year${plural}`;
    }
    return `${duration} Month${plural}`;
  };

  return (
    <Stack
      sx={{
        width: { xs: "100%", sm: "400px", md: "350px", lg: "350px" },
        maxWidth: { xs: "320px", sm: "400px", md: "350px", lg: "350px" },
        height: { xs: "auto", lg: "auto", md: "auto", sm: "auto" },
        borderRadius: "20px",
      }}
    >
      <Stack
        sx={{
          width: "100%",
          backgroundColor: "var(--white)",
          borderRadius: "13px 13px 0px 0px",
          padding: { xs: "10px", sm: "10px", md: "10px", lg: "10px" },
          gap: "10px",
          marginTop: { xs: "10px", sm: "20px", md: "0px", lg: "0px" },
          display: { xs: "none", sm: "none", md: "block", lg: "block" },
        }}
      >
        <Stack
          flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
          justifyContent="space-evenly"
          gap="10px"
        >
          <Stack display={{ xs: "none", sm: "none", md: "block", lg: "block" }}>
            <Image
              src={courseDetails?.thumbnail || defaultThumbnail}
              alt="course thumbnail"
              width={150}
              height={90}
              style={{ borderRadius: "10px" }}
            />
          </Stack>
          <Stack
            sx={{
              display: { xs: "block", sm: "block", md: "none", lg: "none" },
            }}
          >
            <img
              src={courseDetails?.thumbnail || defaultThumbnail.src}
              alt="defaultThumbnail"
              style={{ borderRadius: "10px", width: "100%", height: "100%" }}
            />
          </Stack>
          <Stack gap="5px" marginTop="15px">
            <Typography
              display={{ xs: "block", sm: "block", md: "none", lg: "none" }}
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "16px", sm: "16px", md: "14px", lg: "16px" },
                fontWeight: "700",
              }}
            >
              {courseDetails?.title || ""}
            </Typography>
            <Stack marginTop={{ xs: "10px", sm: "10px", md: "0px", lg: "0px" }}>
              <Select
                variant="outlined"
                value={selectedPlan?.duration || ""}
                onChange={handlePlanChange}
                displayEmpty
                renderValue={(selected) => {
                  const plan = selected
                    ? plans.find((p) => p.duration === selected)
                    : plans[0];
                  return plan ? formatPlanLabel(plan) : "Loading...";
                }}
                MenuProps={{
                  disableScrollLock: true,
                  PaperProps: {
                    sx: {
                      padding: "8px",
                      "& .MuiList-root": {
                        paddingBottom: 0,
                        borderColor: "var(--border-color)",
                      },
                    },
                  },
                }}
                sx={{
                  minWidth: "170px",
                  height: "35px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--sec-color)",
                  },
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--sec-color)",
                    },
                  },
                }}
              >
                {plans.map((plan, index) => (
                  <MenuItem key={index} value={plan.duration}>
                    {formatPlanLabel(plan)}
                  </MenuItem>
                ))}
              </Select>
              {selectedPlan ? (
                <Stack
                  flexDirection="row"
                  gap="5px"
                  marginTop={{ xs: "10px", sm: "10px", md: "0px", lg: "0px" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: {
                        xs: "14px",
                        sm: "16px",
                        md: "14px",
                        lg: "16px",
                      },
                      color: "var(--sec-color)",
                      paddingTop: "5px",
                    }}
                  >
                    ₹
                    {calculateDiscountedPrice(
                      selectedPlan.priceWithTax,
                      selectedPlan.discountInPercent
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: {
                        xs: "14px",
                        sm: "16px",
                        md: "14px",
                        lg: "16px",
                      },
                      paddingTop: "5px",
                    }}
                  >
                    <span style={{ textDecoration: "line-through" }}>
                      ₹{selectedPlan.priceWithTax}
                    </span>{" "}
                    ({selectedPlan.discountInPercent}% off)
                  </Typography>
                </Stack>
              ) : (
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    color: "var(--sec-color)",
                  }}
                >
                  Loading...
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Stack marginTop={{ xs: "10px", sm: "10px", md: "0px", lg: "3px" }}>
          <Typography
            display={{ xs: "none", sm: "none", md: "block", lg: "block" }}
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "14px", sm: "14px", md: "14px", lg: "16px" },
              fontWeight: "700",
            }}
          >
            {courseDetails?.title || ""}
          </Typography>
        </Stack>
      </Stack>

      <Stack display={{ xs: "none", sm: "none", md: "block", lg: "block" }}>
        <Button
          onClick={() => {
            const selectedIndex = plans.findIndex(
              (plan) => plan.duration === selectedPlan?.duration
            );
            console.log(selectedIndex);
            router.push(
              `/dashboard/${goalID}/courses/${courseID}/checkout?plan=${selectedIndex}`
            );
          }}
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--sec-color)",
            width: "100%",
            borderRadius: "0px 0px 10px 10px",
            backgroundColor: "var(--sec-color-acc-1)",
          }}
          disabled={!selectedPlan}
        >
          Proceed to checkout
        </Button>
      </Stack>
      <Stack
        sx={{
          display: { xs: "block", sm: "block", md: "none", lg: "none" },
          position: "fixed",
          bottom: "60px",
          left: "0",
          right: "0",
          zIndex: "1000",
        }}
      >
        <FloatingCheckoutCard
          courseDetails={courseDetails}
          selectedPlan={selectedPlan}
          handlePlanChange={handlePlanChange}
          plans={plans}
          calculateDiscountedPrice={calculateDiscountedPrice}
          formatPlanLabel={formatPlanLabel}
        />
      </Stack>
    </Stack>
  );
}
