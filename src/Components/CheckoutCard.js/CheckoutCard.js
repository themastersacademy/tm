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
          display: { xs: "none", lg: "block" },
          bgcolor: "white",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden",
          position: "sticky",
          top: "24px",
        }}
      >
        {/* Thumbnail */}
        <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
          <Image
            src={courseDetails?.thumbnail || defaultThumbnail}
            alt={courseDetails?.title || "Course Thumbnail"}
            fill
            style={{ objectFit: "cover" }}
          />
          {isFree && (
            <Box
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "#22c55e",
                color: "white",
                px: 1.5,
                py: 0.5,
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
              }}
            >
              FREE
            </Box>
          )}
        </Box>

        <Stack p={3} gap={3}>
          {/* Price Section */}
          {!isPaidCourseForUser && !isFree && selectedPlan && (
            <Stack>
              <Stack direction="row" alignItems="baseline" gap={1}>
                <Typography
                  sx={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
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
                    fontSize: "16px",
                    color: "#94a3b8",
                    textDecoration: "line-through",
                    fontWeight: 500,
                  }}
                >
                  ₹{selectedPlan.priceWithTax}
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#3b82f6",
                    px: 1,
                    py: 0.5,
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {selectedPlan.discountInPercent}% OFF
                </Box>
              </Stack>
            </Stack>
          )}

          {/* Plan Selector */}
          {!isPaidCourseForUser && !isFree && plans.length > 0 && (
            <Stack gap={1}>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}
              >
                Select Validity
              </Typography>
              <Select
                value={selectedPlan?.duration || ""}
                onChange={handlePlanChange}
                displayEmpty
                sx={{
                  borderRadius: "12px",
                  bgcolor: "#f8fafc",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cbd5e1",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6",
                  },
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                {plans.map((plan, index) => (
                  <MenuItem key={index} value={plan.duration}>
                    {formatPlanLabel(plan)}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          )}

          {/* CTA Button */}
          <Button
            onClick={handleCheckout}
            variant="contained"
            fullWidth
            endIcon={<East />}
            disabled={!isFree && !selectedPlan}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
              bgcolor: isPaidCourseForUser ? "#22c55e" : "#3b82f6",
              boxShadow: isPaidCourseForUser
                ? "0 4px 12px rgba(34, 197, 94, 0.3)"
                : "0 4px 12px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                bgcolor: isPaidCourseForUser ? "#16a34a" : "#2563eb",
                boxShadow: isPaidCourseForUser
                  ? "0 6px 16px rgba(34, 197, 94, 0.4)"
                  : "0 6px 16px rgba(59, 130, 246, 0.4)",
              },
            }}
          >
            {isPaidCourseForUser
              ? "Go to Course"
              : isFree
              ? "Enroll for Free"
              : "Buy Now"}
          </Button>

          {/* Features */}
          <Stack gap={2}>
            <Typography
              sx={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}
            >
              This Course Includes:
            </Typography>
            <Stack gap={1.5}>
              {features.map((feature, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                >
                  <Box sx={{ color: "#3b82f6", display: "flex" }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    sx={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}
                  >
                    {feature.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Mobile Floating Card */}
      <Box sx={{ display: { xs: "block", lg: "none" } }}>
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
