import { Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";

export default function PageSkeleton() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack width="100%" minHeight="100vh" margin="0 auto" maxWidth="1200px">
      {/* <Skeleton variant="text" height={80} /> */}
    
      <Stack
        direction={isMedium ? "column" : "row"}
        justifyContent="space-between"
        spacing={12}
      >
        <Stack gap={1} flex={1}>
          <Skeleton variant="text" height={40} width={200} />
          <Stack
            direction={isSmall ? "column" : "row"}
            gap="10px"
            flexWrap="wrap"
          >
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={100}
                width={isSmall ? "100%" : 150}
                sx={{ borderRadius: "5px" }}
              />
            ))}
          </Stack>

          <Skeleton
            variant="rectangular"
            height={300}
            width={isSmall ? "100%" : 630}
            sx={{ borderRadius: "5px" }}
          />

          <Stack
            direction={isSmall ? "column" : "row"}
            gap="10px"
            flexWrap="wrap"
          >
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={160}
                width={isSmall ? "100%" : 150}
                sx={{ borderRadius: "5px" }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack flex={1} gap={1} sx={{ display: { xs: "none", md: "block" } }}>
          <Skeleton variant="text" height={40} width={200} />
          <Skeleton
            variant="rectangular"
            height={320}
            width={isSmall ? "100%" : 450}
            sx={{ borderRadius: "5px" }}
          />
          <Skeleton variant="text" height={40} width={200} />
          <Skeleton
            variant="rectangular"
            height={230}
            width={isSmall ? "100%" : 450}
            sx={{ borderRadius: "5px" }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
