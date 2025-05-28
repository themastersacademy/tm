import { Box, Stack, Typography } from "@mui/material";
import { CheckBox } from "@mui/icons-material";

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
            fontSize: { xs: "16px", sm: "20px", md: "24px" },
          }}
        >
          Upgrade to Pro
        </Typography>
        <Stack gap="4px" marginTop="10px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              fontWeight: "bold",
            }}
          >
            For Students & Aspirants
          </Typography>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox
              sx={{
                color: "var(--sec-color)",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
              }}
            >
              Unlimited practise tests
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox
              sx={{
                color: "var(--sec-color)",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
              }}
            >
              Advanced mock tests
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox
              sx={{
                color: "var(--sec-color)",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
              }}
            >
              Free video courses
            </Typography>
          </Stack>
          <Stack flexDirection="row" gap="10px" alignItems="center">
            <CheckBox
              sx={{
                color: "var(--sec-color)",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Lato",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
              }}
            >
              Advanced tracking
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
