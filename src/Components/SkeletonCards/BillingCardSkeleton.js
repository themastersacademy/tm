import { Skeleton, Stack } from "@mui/material";

export default function BillingCardSkeleton() {
  return (
    <Stack
      width="100%"
      height={150}
      sx={{
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        padding: "10px 20px",
      }}
      direction="row"
      justifyContent="space-between"
    >
      <Stack>
        <Stack>
          <Skeleton
            variant="text"
            width="100px"
            height="40px"
            animation="wave"
            sx={{ backgroundColor: "var(--sec-color-acc-1)" }}
          />
        </Stack>
        <Stack sx={{ marginTop: "auto" }}>
          <Skeleton
            variant="text"
            width="100px"
            height="20px"
            animation="wave"
            sx={{ backgroundColor: "var(--sec-color-acc-1)" }}
          />
          <Skeleton
            variant="text"
            width="100px"
            height="20px"
            animation="wave"
            sx={{ backgroundColor: "var(--sec-color-acc-1)" }}
          />
        </Stack>
      </Stack>
      <Stack>
        <Skeleton
          variant="text"
          width="25px"
          height="50px"
          animation="wave"
          sx={{
            backgroundColor: "var(--sec-color-acc-1)",
            marginLeft: "auto",
          }}
        />
      </Stack>
    </Stack>
  );
}
