import { Skeleton, Stack } from "@mui/material";

export default function InstructionLoading() {
  return (
    <Stack
      width="100%"
      minHeight="80vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        sx={{
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          backgroundColor: "var(--white)",
          width: { xs: "95%", md: "800px" },
          minHeight: "510px",
          padding: { xs: "10px", md: "20px" },
          gap: "30px",
        }}
      >
        <Stack flexDirection="row" justifyContent="space-between">
          <Skeleton variant="text" width={"200px"} height="40px" />
          <Skeleton variant="text" width={"25px"} height="40px" />
        </Stack>
        <Stack gap="20px" alignItems="center">
          <Stack flexDirection="row" flexWrap="wrap" gap="20px">
            <Skeleton
              variant="rectangular"
              width={"200px"}
              height="100px"
              sx={{ borderRadius: "10px" }}
            />
            <Skeleton
              variant="rectangular"
              width={"200px"}
              height="100px"
              sx={{ borderRadius: "10px" }}
            />
          </Stack>
          <Stack flexDirection="row" flexWrap="wrap" gap="20px">
            <Skeleton
              variant="rectangular"
              width={"200px"}
              height="100px"
              sx={{ borderRadius: "10px" }}
            />
            <Skeleton
              variant="rectangular"
              width={"200px"}
              height="100px"
              sx={{ borderRadius: "10px" }}
            />
          </Stack>
          <Stack>
            <Skeleton
              variant="rectangular"
              width={"300px"}
              height="100px"
              sx={{ borderRadius: "10px" }}
            />
          </Stack>
          <Stack alignItems="center">
            <Skeleton variant="text" width={"200px"} height="40px" />
            <Skeleton variant="text" width={"100px"} height="40px" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
