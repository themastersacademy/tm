import { Stack, Skeleton } from "@mui/material";

export default function HeaderSkeleton() {
  return (
    <Stack>
      <Skeleton variant="text" height={80} width="100%" />
    </Stack>
  );
}
