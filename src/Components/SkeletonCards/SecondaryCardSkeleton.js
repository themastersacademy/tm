import { Card, Stack, Skeleton } from "@mui/material";

export default function SecondaryCardSkeleton({ fullWidth }) {
  return (
    <Card
      sx={{
        width: fullWidth ? "100%" : "400px",
        height: "80px",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
      }}
      elevation={0}
    >
      <Stack alignItems="center" gap="7px" flexDirection="row">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "60px",
            height: "60px",
            borderRadius: "10px",
            bgcolor: "var(--sec-color-acc-1)",
          }}
        />
        <Skeleton variant="text" width={80} />
        <Skeleton variant="rounded" width={7} sx={{ marginLeft: "auto" }} />
      </Stack>
    </Card>
  );
}
