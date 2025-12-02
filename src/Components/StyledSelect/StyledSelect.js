import { Add } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function StyledSelect({
  title,
  value,
  onChange,
  options,
  getLabel = (option) => option?.label,
  getValue = (option) => option?.id,
  button,
  disable,
  sx = {},
}) {
  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <FormControl size="small" disabled={disable} {...sx}>
      <InputLabel
        sx={{
          fontFamily: "var(--font-geist-sans)",
          "&.Mui-focused": {
            color: "var(--primary-color)",
          },
        }}
      >
        {title || "Select"}
      </InputLabel>
      <Select
        label={title || "Select"}
        size="small"
        value={value ?? ""}
        onChange={onChange}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              borderRadius: "12px",
              marginTop: "8px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              "& .MuiMenuItem-root": {
                fontFamily: "var(--font-geist-sans)",
                fontSize: "14px",
                padding: "10px 16px",
                "&:hover": {
                  backgroundColor: "var(--sec-color-acc-2)",
                },
                "&.Mui-selected": {
                  backgroundColor: "var(--primary-color-acc-2) !important",
                  color: "var(--primary-color)",
                  fontWeight: 600,
                },
              },
            },
          },
        }}
        sx={{
          borderRadius: "12px",
          fontFamily: "var(--font-geist-sans)",
          fontSize: "14px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary-color)",
          },
          ...sx,
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={getValue(option)}>
            {getLabel(option)}
          </MenuItem>
        ))}
        {button && options.length >= 3 && (
          <MenuItem
            key="add-button"
            value=""
            disableRipple
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant="contained"
              endIcon={<Add />}
              sx={{
                width: "100%",
                textAlign: "center",
                textTransform: "none",
                p: "6px",
                backgroundColor: "var(--primary-color)",
                borderRadius: "8px",
                fontFamily: "var(--font-geist-sans)",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--primary-color)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
              onClick={handleAddClick}
              disableElevation
            >
              Add Goal
            </Button>
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}
