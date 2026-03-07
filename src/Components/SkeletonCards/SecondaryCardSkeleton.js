import { Card, Stack, Skeleton } from "@mui/material";

export default function SecondaryCardSkeleton({ fullWidth }) {
  return (
    <Card
      sx={{
        width: fullWidth ? "100%" : "300px",
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
      }}
      elevation={0}
    >
      <Stack alignItems="center" gap="12px" flexDirection="row">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            flexShrink: 0,
          }}
        />
        <Stack gap="4px" flex={1}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Stack>
      </Stack>
    </Card>
  );
}
