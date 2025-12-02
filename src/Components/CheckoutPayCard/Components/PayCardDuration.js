import { Box, Stack, Select, MenuItem } from "@mui/material";

export default function PayCardDuration({
  courseDetails,
  selectedPlan,
  handlePlanChange,
  planIndex,
  couponDetails,
}) {
  // Determine the index of the selected plan
  const selectedPlanIndex =
    courseDetails?.subscription?.plans.findIndex(
      (plan) =>
        plan.duration === selectedPlan?.duration &&
        plan.type === selectedPlan?.type
    ) || 0;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pt={0.5}
      >
        <Select
          variant="outlined"
          value={selectedPlanIndex}
          onChange={(e) => {
            handlePlanChange(e.target.value); // Pass index directly
          }}
          displayEmpty
          renderValue={(selected) => {
            const plan =
              courseDetails?.subscription?.plans[selected] ||
              courseDetails?.subscription?.plans[0];
            return plan
              ? `${plan.duration} ${plan.type === "MONTHLY" ? "month" : "year"}`
              : "Select a plan";
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
            minWidth: "100%",
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
          {courseDetails?.subscription?.plans.map((plan, index) => {
            const actualPriceRaw = plan.priceWithTax / 1.18; // Assuming 18% tax
            const isEligible =
              !couponDetails?.minOrderAmount ||
              actualPriceRaw >= couponDetails.minOrderAmount;

            return (
              <MenuItem key={index} value={index}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  width="100%"
                  alignItems="center"
                >
                  <Box>
                    {`${plan.duration} ${
                      plan.type === "MONTHLY" ? "month" : "year"
                    } - ₹${plan.priceWithTax}`}
                  </Box>
                  {couponDetails && (
                    <Box
                      sx={{
                        fontSize: "12px",
                        color: isEligible ? "green" : "orange",
                        ml: 1,
                      }}
                    >
                      {isEligible ? "Coupon Applicable" : "Min order not met"}
                    </Box>
                  )}
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
      </Stack>
    </Box>
  );
}
