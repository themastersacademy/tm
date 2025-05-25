"use client";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gateCse from "@/public/images/gate_cse.svg";
import placements from "@/public/images/placements.svg";
import banking from "@/public/images/banking.svg";


export default function FormCreate() {
  const router = useRouter();
  return (
    <Stack
      sx={{
        width: "350px",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      <Stack gap={1}>
        <Typography
          sx={{
            fontSize: "Lato",
            fontSize: "20px",
            fontWeight: "500",
            color: "var(--text2)",
          }}
        >
          Username
        </Typography>
        <StyledTextField
          placeholder="Enter your email"
          sx={{ width: "350px" }}
        />
      </Stack>
      <Stack gap="10px">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "20px",
            fontWeight: "500",
            color: "var(--text2)",
          }}
        >
          Select goal
        </Typography>
        <Stack gap="25px" flexDirection="row">
          <Stack gap="10px">
            <Stack
              sx={{
                width: "62px",
                height: "62px",
                backgroundColor: "var(--sec-color-acc-2)",
                borderRadius: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={gateCse} alt="" width={22} height={25} />
            </Stack>
            <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
              GATE CSE
            </Typography>
          </Stack>
          <Stack gap="10px">
            <Stack
              sx={{
                width: "62px",
                height: "62px",
                backgroundColor: "var(--sec-color-acc-2)",
                borderRadius: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={placements} alt="" width={22} height={25} />
            </Stack>
            <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
              Placements
            </Typography>
          </Stack>
          <Stack gap="10px">
            <Stack
              sx={{
                width: "62px",
                height: "62px",
                backgroundColor: "var(--sec-color-acc-2)",
                borderRadius: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src={banking} alt="" width={22} height={25} />
            </Stack>
            <Typography sx={{ fontFamily: "Lato", fontSize: "12px" }}>
              Banking
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Button
        variant="contained"
        sx={{
          textTransform: "none",
          backgroundColor: "var(--primary-color)",
          borderRadius: "4px",
          fontFamily: "Lato",
          fontSize: "18px",
          height: "40px",
          width: "350px",
        }}
        disableElevation
      >
        Create
      </Button>
    </Stack>
  );
}
