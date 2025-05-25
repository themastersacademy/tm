import { Box, Stack, Typography } from "@mui/material";
import { CheckBox } from "@mui/icons-material";
import Image from "next/image";
import proSubscription from "@/public/images/proSubscriptionBanner.svg";

export default function SubscriptionHeader() {
  return (
    <Box>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
        }}
      >
        {/* <Image
          src={proSubscription.src}
          alt="proSubscription"
          width={370}
          height={250}
          style={{ borderRadius: "10px", width: "100%", height: "auto" }}
        /> */}

        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "var(--primary-color)",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Upgrade to Pro
        </Typography>
        <Stack gap="4px" marginTop="10px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            For Students & Aspirants
          </Typography>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox sx={{ color: "var(--sec-color)" }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              Unlimited practise tests
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox sx={{ color: "var(--sec-color)" }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              Advanced mock tests
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox sx={{ color: "var(--sec-color)" }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              Free video courses
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox sx={{ color: "var(--sec-color)" }} />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: "16px",
              }}
            >
              Advanced tracking
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Course Title */}
      <Stack sx={{ paddingTop: "10px", display: { sm: "none", md: "block" } }}>
        {/* <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
          {courseDetails?.title}
          Title
        </Typography> */}
      </Stack>
    </Box>
  );
}
