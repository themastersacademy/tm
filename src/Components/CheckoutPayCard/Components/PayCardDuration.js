import { Box, Stack, Select, MenuItem } from "@mui/material";

export default function PayCardDuration({
  courseDetails,
  selectedPlan,
  handlePlanChange,
  planIndex,
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
            const plan = courseDetails?.subscription?.plans[selected] || courseDetails?.subscription?.plans[0];
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
          {courseDetails?.subscription?.plans.map((plan, index) => (
            <MenuItem key={index} value={index}>
              {`${plan.duration} ${plan.type === "MONTHLY" ? "month" : "year"}`}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Box>
  );
}