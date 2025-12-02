import { IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import mastersLogo from "@/public/images/masters-logo.svg";
import { Notifications } from "@mui/icons-material";
import mCoins from "@/public/icons/mCoins.svg";

export default function MobileHeader() {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        height: "64px",
        padding: "0 16px",
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border-color)",
        display: { xs: "flex", md: "none" },
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Stack>
        <Image src={mastersLogo} alt="logo" width={60} height={26} />
      </Stack>
      <Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          sx={{ marginLeft: "auto", gap: "12px" }}
        >
          <IconButton sx={{ padding: "4px" }}>
            <Notifications sx={{ color: "var(--primary-color)" }} />
          </IconButton>
          <Stack
            flexDirection="row"
            alignItems="center"
            gap="4px"
            sx={{
              backgroundColor: "var(--sec-color-acc-1)",
              padding: "4px 8px",
              borderRadius: "16px",
            }}
          >
            <Image src={mCoins} alt="mCoins" width={16} height={16} />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--sec-color)",
              }}
            >
              100
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
