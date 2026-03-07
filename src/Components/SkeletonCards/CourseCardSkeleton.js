import { Skeleton, Stack } from "@mui/material";

export default function CourseCardSkeleton() {
  return (
    <Stack
      sx={{
        width: "100%",
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          height: "160px",
        }}
      />
      <Stack sx={{ padding: "14px 16px", gap: "10px" }}>
        <Skeleton variant="text" sx={{ width: "80%", height: 18 }} />
        <Stack direction="row" gap="8px">
          <Skeleton variant="rectangular" sx={{ width: 50, height: 20, borderRadius: "6px" }} />
          <Skeleton variant="rectangular" sx={{ width: 50, height: 20, borderRadius: "6px" }} />
        </Stack>
        <Stack
          direction="row"
          gap="12px"
          sx={{ paddingTop: "10px", borderTop: "1px solid var(--border-color)" }}
        >
          <Skeleton variant="text" sx={{ width: 70 }} />
          <Skeleton variant="text" sx={{ width: 60 }} />
        </Stack>
      </Stack>
    </Stack>
  );
}
