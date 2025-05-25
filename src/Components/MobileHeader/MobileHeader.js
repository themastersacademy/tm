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
        height: "60px",
        padding: "10px",
        backgroundColor: "var(--white)",
        marginTop: "15px",
        display: { xs: "flex", md: "none" },
      }}
    >
      <Stack>
        <Image src={mastersLogo} alt="logo" width={60} height={26} />
      </Stack>
      <Stack>
        <Stack
          flexDirection="row"
          alignItems="center"
          sx={{ marginLeft: "auto", gap: "8px" }}
        >
          <IconButton sx={{ padding: "0px" }}>
            <Notifications sx={{ color: "var(--primary-color)" }} />
          </IconButton>
          <Image src={mCoins} alt="mCoins" />
          <Typography>100</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
