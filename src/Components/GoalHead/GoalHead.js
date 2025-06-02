"use client";
import { useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import gate_cse from "@/public/icons/gate_cse.svg";
import banking from "@/public/icons/banking.svg";
import placements from "@/public/icons/placements.svg";
import { ArrowBackIosRounded, East } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";

export default function GoalHead({ title, icon, isPro }) {
  const router = useRouter();
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        maxWidth: "1200px",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        padding: "20px",
        height: "60px",
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="15px">
        <ArrowBackIosRounded
          onClick={() => {
            router.back();
          }}
          sx={{
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "700",
          }}
        />
        <Stack
          sx={{
            width: "40px",
            height: "40px",
            backgroundColor: "var(--sec-color-acc-1)",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={
              icon === "org"
                ? banking
                : icon === "castle"
                ? gate_cse
                : placements
            }
            alt="icon"
            width="16"
            height="17"
          />
        </Stack>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
        >
          {title}
        </Typography>
      </Stack>
      {isPro && (
        <Button
          variant="text"
          endIcon={<East />}
          onClick={handlePlansDialogOpen}
          sx={{
            textTransform: "none",
            width: "120px",
            color: "var(--primary-color)",
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
            borderRadius: "5px",
          }}
          disableElevation
        >
          Get Pro
        </Button>
      )}
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </Stack>
  );
}
