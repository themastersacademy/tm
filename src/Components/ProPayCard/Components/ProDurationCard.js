import { Box, Stack, Select, MenuItem } from "@mui/material";

export default function ProDurationCard({
  plans,
  selectedPlan,
  handlePlanChange,
  planIndex,
  selectedPlanIndex, // Added from ProPayCard.js
}) {
  // Use selectedPlanIndex if provided; otherwise, compute from selectedPlan
  const selectedIndex =
    selectedPlanIndex >= 0 && plans[selectedPlanIndex]
      ? selectedPlanIndex
      : selectedPlan
      ? plans.findIndex((p) => p.duration === selectedPlan.duration)
      : 0;

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
          value={selectedIndex >= 0 ? selectedIndex : ""}
          onChange={(e) => handlePlanChange(e.target.value)}
          displayEmpty
          renderValue={(selected) => {
            const plan =
              selected >= 0 && plans[selected] ? plans[selected] : plans[0];
            if (!plan) {
              return "";
            }
            return `${plan.duration} ${
              plan.type === "MONTHLY" ? "month" : "year"
            }`;
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
          {plans.map((plan, index) => (
            <MenuItem key={index} value={index}>
              {`${plan.duration} ${plan.type === "MONTHLY" ? "month" : "year"}`}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Box>
  );
}