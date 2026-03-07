import { Avatar, Stack, Typography } from "@mui/material";

export default function LeaderboardCard({ sNo, name, points }) {
  return (
    <Stack
      flexDirection="row"
      sx={{
        width: "100%",
        backgroundColor: "rgba(24, 113, 99, 0.04)",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: "var(--primary-color)",
        },
      }}
    >
      <Stack flexDirection="row" alignItems="center" gap="10px">
        <Stack
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text3)",
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--white)",
          }}
        >
          {sNo}
        </Stack>
        <Avatar sx={{ width: 32, height: 32 }} />
        <Stack gap="2px">
          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "var(--text1)" }}>
            {name}
          </Typography>
          <Typography
            sx={{ fontSize: "11px", color: "var(--text4)" }}
          >
            {points}
          </Typography>
        </Stack>
      </Stack>
      <Avatar
        sx={{ backgroundColor: "var(--sec-color)", padding: "4px", width: 28, height: 28 }}
      />
    </Stack>
  );
}
