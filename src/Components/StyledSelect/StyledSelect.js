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
    <FormControl
      //   // sx={{ minWidth: "200px" }}
      size="small"
      disabled={disable}
      {...sx}
    >
      <InputLabel
        sx={{
          "&.Mui-focused": {
            color: "var(--sec-color)",
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
        MenuProps={{ disableScrollLock: true }}
        sx={{
          maxHeight: "40px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--sec-color)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--sec-color)",
          },
        }}
        {...sx}
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
                p: "2px",
                backgroundColor: "var(--primary-color)",
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
