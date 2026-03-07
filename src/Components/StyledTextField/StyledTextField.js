"use client";
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const StyledTextField = styled(TextField)(({ description }) => ({
  width: "100%",
  userSelect: "text",
  "& .MuiOutlinedInput-root": {
    height: description ? "80px" : "36px",
    borderRadius: "8px",
    fontFamily: "Lato",
    fontWeight: "400",
    fontSize: "13px",
    "&.Mui-focused fieldset": {
      borderColor: "var(--primary-color)",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "var(--primary-color)",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "var(--text4)",
    opacity: 1,
    fontSize: "13px",
  },
}));

export default StyledTextField;
