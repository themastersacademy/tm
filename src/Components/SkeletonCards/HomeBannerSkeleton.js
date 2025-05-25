import { Skeleton, Stack } from "@mui/material";

export default function HomeBannerSkeleton() {
  return (
    <Stack
      sx={{
        width: "100%",
        position: "relative",
        aspectRatio: "3 / 1.5",
        borderRadius: "20px",
        overflow: "hidden",
        maxHeight:"600px"
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </Stack>
  );
}
