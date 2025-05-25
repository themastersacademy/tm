import React from "react";
import { Stack, Typography } from "@mui/material";
import MasterLogo from "@/public/images/masters-logo.svg";
import Image from "next/image";

export default function CheckoutHeader() {
  return (
    <Stack>
      <Stack
        backgroundColor="var(--white)"
        sx={{
          padding: "10px 20px",
          display: "flex",
          flexDirection: "row", 
          alignItems: "center", 
          gap: "10px", 
        }}
      >
        <Image src={MasterLogo} alt="Master Logo" width={50} height={50} /> {/* Adjust size as needed */}
        <Typography
          color="var(--primary-color)"
          sx={{ fontSize: "20px", fontWeight: "bold" }}
        >
          <span style={{ color: "var(--sec-color)" }}>The</span> Masters Academy
        </Typography>
      </Stack>
    </Stack>
  );
}