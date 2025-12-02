import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import anticheat from "@/public/icons/anticheat.svg";
import fullscreen from "@/public/icons/fullscreen.svg";
import mcoins from "@/public/icons/mCoins.svg";

export default function KnowYourTest({ instruction }) {
  return (
    <Stack
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        width: "100%",
        minHeight: "auto",
        padding: "20px",
        gap: "16px",
        bgcolor: "#f8fafc",
        display:
          instruction?.settings?.isAntiCheat ||
          instruction?.settings?.isFullScreenMode ||
          instruction?.settings?.mCoinReward?.rewardCoin > 0
            ? "flex"
            : "none",
      }}
    >
      <Stack>
        <Typography sx={{ fontSize: "14px" }}>Know your Test</Typography>
      </Stack>
      <Stack flexDirection="row" flexWrap="wrap" gap="15px">
        {instruction?.settings?.isAntiCheat && (
          <Stack flexDirection="row" gap="10px">
            <Image src={anticheat} alt="icon" />
            <Typography sx={{ fontSize: "14px" }}>
              Anti-Cheat Protection
            </Typography>
          </Stack>
        )}
        {instruction?.settings?.isFullScreenMode && (
          <Stack flexDirection="row" gap="10px">
            <Image src={fullscreen} alt="icon" />
            <Typography sx={{ fontSize: "14px" }}>Full Screen Mode</Typography>
          </Stack>
        )}
        {instruction?.settings?.mCoinReward?.rewardCoin > 0 && (
          <Stack flexDirection="row" gap="10px">
            <Image src={mcoins} alt="icon" />
            <Typography
              sx={{ fontSize: "14px" }}
            >{`If you score above ${instruction?.settings?.mCoinReward.conditionPercent}% in this exam, you will earn ${instruction?.settings?.mCoinReward.rewardCoin} Mcoins`}</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
