import { Stack, Skeleton } from "@mui/material";

export default function HeaderSkeleton() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        width: "100%",
        height: "56px",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--white)",
        padding: "0 16px",
      }}
    >
      <Stack direction="row" alignItems="center" gap="12px">
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: "10px" }} />
        <Stack gap="4px">
          <Skeleton variant="text" width={60} height={14} />
          <Skeleton variant="text" width={100} height={16} />
        </Stack>
      </Stack>
      <Skeleton variant="rectangular" width={80} height={34} sx={{ borderRadius: "8px" }} />
    </Stack>
  );
}
