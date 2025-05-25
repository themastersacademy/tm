import { Skeleton, Stack } from "@mui/material";

export default function LessoncardSkeleton() {
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
        backgroundColor: "var(--white)",
      }}
      elevation={0}
    >
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ width: "24px", height: "24px" }}
      />
      <Skeleton variant="text" animation="wave" sx={{ width: "100px" }} />
      <Skeleton
        variant="circular"
        animation="wave"
        sx={{ width: "24px", height: "24px", marginLeft: "auto" }}
      />
    </Stack>
  );
}
