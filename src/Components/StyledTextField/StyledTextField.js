"use client";
import { TextField } from "@mui/material";
import { height, maxHeight, minHeight, styled } from "@mui/system";

const StyledTextField = styled(TextField)(({description}) => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: description ?  "80px" : "40px",
    borderRadius: "5px",
    fontFamily: "Lato",
    fontWeight: "400",
    fontSize: "16px",
    "&.Mui-focused fieldset": {
      borderColor: "var(--sec-color)",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "var(--sec-color)",
    },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "var(--text4)", 
    opacity: 1, 
  },
}));

export default StyledTextField;
