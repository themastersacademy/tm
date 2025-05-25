import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function SubscriptionSelect({ value, options }) {
  return (
    <FormControl size="small">
      <InputLabel
        sx={{
          "&.Mui-focused": {
            color: "var(--text1)",
          },
        }}
      >
        Select Duration
      </InputLabel>
      <Select
        label="Select Duration"
        size="small"
        value={value}
        MenuProps={{ disableScrollLock: true }}
        sx={{
          // color: "var(--white)",
          backgroundColor: "var(--white)",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--white)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--white)",
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
