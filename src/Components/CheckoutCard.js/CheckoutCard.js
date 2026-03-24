"use client";
import {
  East,
  CheckCircle,
  Verified,
  AllInclusive,
  Devices,
} from "@mui/icons-material";
import {
  Button,
  Stack,
  Typography,
  Select,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import { useRouter, useParams } from "next/navigation";
import FloatingCheckoutCard from "./Components/FloatingCheckoutCard";
import { useSession } from "next-auth/react";

export default function CheckoutCard({ courseDetails, isPaidCourseForUser }) {
  const plans = courseDetails?.subscription?.plans || [];
  const isFree = courseDetails?.subscription?.isFree || false;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { goalID, courseID } = params;
  const { data: session } = useSession();

  // Set default plan
  useEffect(() => {
    if (!isFree && plans.length > 0 && !selectedPlan) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan, isFree]);

  const handlePlanChange = (event) => {
    const selectedDuration = event.target.value;
    const selected = plans.find((plan) => plan.duration === selectedDuration);
    if (selected) setSelectedPlan(selected);
  };

  const calculateDiscountedPrice = (originalPrice, discountInPercent) => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountInPercent);
    if (isNaN(price) || isNaN(discount) || discount < 0 || discount >= 100)
      return 0;
    return Math.round(price * (1 - discount / 100));
  };

  const formatPlanLabel = (plan) => {
    const duration = parseInt(plan.duration, 10);
    const plural = duration > 1 ? "s" : "";
    if (plan.type === "YEARLY") return `${duration} Year${plural}`;
    return `${duration} Month${plural}`;
  };

  const handleCheckout = () => {
    if (isFree) {
      router.push(`/dashboard/${goalID}/courses/${courseID}/checkout`);
    } else {
      const selectedIndex = plans.findIndex(
        (plan) => plan.duration === selectedPlan?.duration
      );
      if (selectedIndex !== -1) {
        router.push(
          `/dashboard/${goalID}/courses/${courseID}/checkout?plan=${selectedIndex}`
        );
      }
    }
  };

  const features = [
    {
      icon: <AllInclusive sx={{ fontSize: 20 }} />,
      text: "Full Lifetime Access",
    },
    {
      icon: <Devices sx={{ fontSize: 20 }} />,
      text: "Access on Mobile and Desktop",
    },
    {
      icon: <Verified sx={{ fontSize: 20 }} />,
      text: "Certificate of Completion",
    },
  ];

  return (
    <>
      {/* Desktop Card */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          bgcolor: "white",
          borderRadius: "10px",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <Stack p={2} gap={2}>
          {/* Course Name */}
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text1)",
              fontFamily: "Lato",
              lineHeight: 1.3,
            }}
          >
            {courseDetails?.title}
          </Typography>

          {/* Plan Selector */}
          {!isFree && plans.length > 0 && (
            <Select
              value={selectedPlan?.duration || ""}
              onChange={handlePlanChange}
              displayEmpty
              size="small"
              sx={{
                borderRadius: "8px",
                bgcolor: "var(--bg1)",
                fontSize: "13px",
                fontWeight: 600,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border-color)" },
              }}
            >
              {plans.map((plan, index) => (
                <MenuItem key={index} value={plan.duration}>
                  {formatPlanLabel(plan)}
                </MenuItem>
              ))}
            </Select>
          )}

          {/* Price Section */}
          {isFree ? (
            <Typography
              sx={{ fontSize: "22px", fontWeight: 800, color: "#22c55e", lineHeight: 1 }}
            >
              Free
            </Typography>
          ) : selectedPlan ? (
            <Stack direction="row" alignItems="baseline" gap={1}>
              <Typography
                sx={{ fontSize: "22px", fontWeight: 800, color: "var(--text1)", lineHeight: 1 }}
              >
                ₹{calculateDiscountedPrice(selectedPlan.priceWithTax, selectedPlan.discountInPercent)}
              </Typography>
              {selectedPlan.discountInPercent > 0 && (
                <>
                  <Typography
                    sx={{ fontSize: "13px", color: "var(--text4)", textDecoration: "line-through" }}
                  >
                    ₹{selectedPlan.priceWithTax}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "var(--sec-color-acc-2)",
                      color: "var(--sec-color)",
                      px: 0.8,
                      py: 0.3,
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {selectedPlan.discountInPercent}% OFF
                  </Box>
                </>
              )}
            </Stack>
          ) : null}

          {/* CTA Button */}
          <Button
            onClick={handleCheckout}
            variant="contained"
            fullWidth
            endIcon={<East />}
            disabled={!isFree && !selectedPlan}
            disableElevation
            sx={{
              py: 1.2,
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 700,
              bgcolor: "var(--primary-color)",
              "&:hover": { bgcolor: "var(--primary-color-dark)" },
            }}
          >
            {isPaidCourseForUser
              ? "Go to Course"
              : isFree
              ? "Enroll for Free"
              : "Proceed to checkout"}
          </Button>

        </Stack>
      </Box>

      {/* Mobile Floating Card */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <FloatingCheckoutCard
          courseDetails={courseDetails}
          selectedPlan={selectedPlan}
          handlePlanChange={handlePlanChange}
          plans={plans}
          calculateDiscountedPrice={calculateDiscountedPrice}
          formatPlanLabel={formatPlanLabel}
          handleCheckout={handleCheckout}
          isFree={isFree}
          isPaidCourseForUser={isPaidCourseForUser}
        />
      </Box>
    </>
  );
}
