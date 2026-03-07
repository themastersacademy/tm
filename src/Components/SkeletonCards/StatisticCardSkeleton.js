import { Card, Stack, Skeleton } from "@mui/material";

export default function StatisticCardSkeleton() {
  return (
    <Card
      sx={{
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
      }}
      elevation={0}
    >
      <Stack gap="12px">
        <Stack direction="row" alignItems="center" gap="10px">
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
            }}
          />
          <Skeleton variant="text" width={60} />
        </Stack>
        <Skeleton variant="text" width={40} height={32} />
      </Stack>
    </Card>
  );
}
