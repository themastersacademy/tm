"use client"
import { Stack, Typography, Select, MenuItem, Button } from "@mui/material";
import { East } from "@mui/icons-material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";

export default function FloatingCheckoutCard({
  courseDetails,
  selectedPlan,
  handlePlanChange,
  plans,
  calculateDiscountedPrice,
  formatPlanLabel,
  handleCheckout,
  isFree, // Added isFree prop
}) {
  // Return early if courseDetails is not available
  if (!courseDetails) {
    return (
      <Stack
        sx={{
          backgroundColor: "white",
          padding: "10px",
          height: "120px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Loading...</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        backgroundColor: "white",
        padding: "10px",
        height: "120px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        alignItems="center"
        justifyContent={{ xs: "center", sm: "space-between" }}
      >
        <Stack display="flex-start" flexDirection="row" gap={2}>
          <Stack display={{ xs: "none", sm: "flex" }}>
            <Image
              src={courseDetails?.thumbnail || defaultThumbnail}
              alt="course thumbnail"
              width={120}
              height={70}
              style={{ borderRadius: "5px" }}
            />
          </Stack>
          <Stack display={{ xs: "flex", sm: "none" }}>
            <Image
              src={courseDetails?.thumbnail || defaultThumbnail}
              alt="course thumbnail"
              width={100}
              height={60}
              style={{ borderRadius: "5px" }}
            />
          </Stack>
          {/* Plan Selector and Price */}
          <Stack
            flexDirection={{ xs: "column" }}
            marginTop={{ xs: "10px", sm: "10px", md: "0px", lg: "0px" }}
          >
            <Stack
              flexDirection="row"
              gap={2}
              alignItems="center"
              display={{ xs: "flex", sm: "none" }}
            >
              {/* Show Select only for non-free courses */}
              {!isFree && (
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
                    minWidth: { xs: "100px", sm: "140px" },
                    height: { xs: "30px", sm: "35px" },
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
              )}
              <Button
                onClick={handleCheckout}
                variant="text"
                endIcon={<East />}
                sx={{
                  textTransform: "none",
                  fontFamily: "Lato",
                  fontSize: { xs: "10px", sm: "14px" },
                  fontWeight: "700",
                  color: "var(--sec-color)",
                  borderRadius: "5px",
                  backgroundColor: "var(--sec-color-acc-1)",
                  padding: "10px",
                  minWidth: { xs: "80px", sm: "120px" },
                  height: { sm: "38px", xs: "32px" },
                }}
                disabled={!isFree && !selectedPlan} // Disable if not free and no plan selected
              >
                {isFree ? "Enroll Now" : "checkout"}
              </Button>
            </Stack>
            {/* Price (only for non-free courses) */}
            {!isFree && selectedPlan ? (
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
                      sm: "14px",
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
                      sm: "14px",
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
            ) : !isFree ? (
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "10px",
                  color: "var(--sec-color)",
                }}
              >
                Loading...
              </Typography>
            ) : null}
          </Stack>
        </Stack>
        <Stack
          flexDirection="row"
          gap={2}
          alignItems="center"
          display={{ xs: "none", sm: "flex" }}
        >
          {/* Show Select only for non-free courses */}
          {!isFree && (
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
                minWidth: { xs: "100px", sm: "140px" },
                height: { xs: "30px", sm: "35px" },
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
          )}
          <Button
            onClick={handleCheckout}
            variant="text"
            endIcon={<East />}
            sx={{
              textTransform: "none",
              fontFamily: "Lato",
              fontSize: { xs: "10px", sm: "14px" },
              fontWeight: "700",
              color: "var(--sec-color)",
              borderRadius: "5px",
              backgroundColor: "var(--sec-color-acc-1)",
              padding: "10px",
              minWidth: { xs: "100px", sm: "120px" },
              height: { sm: "38px" },
            }}
            disabled={!isFree && !selectedPlan} // Disable if not free and no plan selected
          >
            {isFree ? "Enroll Now" : "checkout"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}