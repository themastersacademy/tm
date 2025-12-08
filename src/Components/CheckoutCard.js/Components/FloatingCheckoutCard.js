"use client";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { East } from "@mui/icons-material";

export default function FloatingCheckoutCard({
  courseDetails,
  selectedPlan,
  handlePlanChange,
  plans,
  calculateDiscountedPrice,
  formatPlanLabel,
  handleCheckout,
  isFree,
  isPaidCourseForUser,
}) {
  if (!courseDetails) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "white",
        borderTop: "1px solid #e2e8f0",
        p: 2,
        zIndex: 1000,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
        pb: "safe-area-inset-bottom", // Handle iPhone home bar
      }}
    >
      <Stack gap={2} maxWidth="md" mx="auto">
        {/* Plan Selector (if applicable) */}
        {!isPaidCourseForUser && !isFree && plans.length > 0 && (
          <Select
            value={selectedPlan?.duration || ""}
            onChange={handlePlanChange}
            displayEmpty
            variant="standard"
            disableUnderline
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#64748b",
              "& .MuiSelect-select": { py: 0 },
            }}
          >
            {plans.map((plan, index) => (
              <MenuItem key={index} value={plan.duration}>
                {formatPlanLabel(plan)}
              </MenuItem>
            ))}
          </Select>
        )}

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          {/* Price Section */}
          <Stack>
            {isPaidCourseForUser ? (
              <Typography
                sx={{ fontSize: "16px", fontWeight: 700, color: "#22c55e" }}
              >
                Purchased
              </Typography>
            ) : isFree ? (
              <Typography
                sx={{ fontSize: "20px", fontWeight: 800, color: "#22c55e" }}
              >
                Free
              </Typography>
            ) : selectedPlan ? (
              <Stack alignItems="flex-start">
                <Stack direction="row" alignItems="baseline" gap={1}>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}
                  >
                    ₹
                    {calculateDiscountedPrice(
                      selectedPlan.priceWithTax,
                      selectedPlan.discountInPercent
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      textDecoration: "line-through",
                      fontWeight: 500,
                    }}
                  >
                    ₹{selectedPlan.priceWithTax}
                  </Typography>
                </Stack>
                <Typography
                  sx={{ fontSize: "10px", color: "#22c55e", fontWeight: 700 }}
                >
                  {selectedPlan.discountInPercent}% OFF
                </Typography>
              </Stack>
            ) : (
              <Typography sx={{ fontSize: "14px", color: "#64748b" }}>
                Loading...
              </Typography>
            )}
          </Stack>

          {/* Action Button */}
          <Button
            onClick={handleCheckout}
            variant="contained"
            endIcon={<East />}
            disabled={!isFree && !selectedPlan}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "100px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 700,
              bgcolor: isPaidCourseForUser ? "#22c55e" : "#3b82f6",
              boxShadow: isPaidCourseForUser
                ? "0 4px 12px rgba(34, 197, 94, 0.3)"
                : "0 4px 12px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                bgcolor: isPaidCourseForUser ? "#16a34a" : "#2563eb",
              },
            }}
          >
            {isPaidCourseForUser ? "Open" : isFree ? "Enroll Now" : "Buy Now"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
