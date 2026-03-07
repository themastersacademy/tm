import { Card, Stack, Skeleton } from "@mui/material";

export default function PrimaryCardSkeleton() {
  return (
    <Card
      sx={{
        width: { xs: "100%", sm: "280px" },
        minHeight: "180px",
        padding: "16px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
      }}
      elevation={0}
    >
      <Stack alignItems="center" gap="10px">
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
          }}
        />
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={100} />
      </Stack>
    </Card>
  );
}
