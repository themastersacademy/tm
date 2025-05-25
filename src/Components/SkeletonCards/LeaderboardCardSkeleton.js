import { Skeleton, Stack } from "@mui/material";

export default function LeaderboardCardSkeleton() {
  return (
    <Stack
      flexDirection="row"
      gap="10px"
      alignItems="center"
      sx={{
        width: "310px",
        height: "70px",
        padding: "10px",
        borderRadius: "10px",
        backgroundColor:"var(--sec-color-acc-2)",
      }}
      elevation={0}
    >
        <Skeleton variant="circular" animation="wave" sx={{ width: "24px", height: "24px"}} />
      <Skeleton variant="circular" animation="wave" sx={{ width: "40px", height: "40px" }} />
      <Skeleton variant="text" animation="wave" sx={{ width: "100px" }} />
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ width: "40px", height: "40px", marginLeft: "auto" }}
      />
    </Stack>
  );
}
