import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import SubscribeBanner from "@/public/images/subscribeBanner.svg";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";

export default function Subscribe() {
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);

  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };

  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        maxWidth: "800px",
        minHeight: "350px",
        padding: "25px",
        gap: "10px",
      }}
    >
      <Stack gap="25px">
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--text3)",
          }}
        >
          Get unlimited practice tests with PRO subscription
        </Typography>
        <Stack gap="8px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "14px",
              color: "var(--text3)",
            }}
          >
            Track your perfomance with unlimited daily practice tests
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "14px",
              color: "var(--text3)",
            }}
          >
            Get access to test quizzes
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "14px",
              color: "var(--text3)",
            }}
          >
            Attempt mock with pro questions
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "14px",
              color: "var(--text3)",
            }}
          >
            Get access to video lectures
          </Typography>
        </Stack>
        <Button
          variant="contained"
          onClick={handlePlansDialogOpen}
          sx={{
            textTransform: "none",
            backgroundColor: "var(--primary-color)",
            width: "130px",
            marginTop: "auto",
          }}
          disableElevation
        >
          Subscribe
        </Button>
      </Stack>
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
      <Stack>
        <Image src={SubscribeBanner} alt="subscribe" width={340} height={320} />
      </Stack>
    </Stack>
  );
}
