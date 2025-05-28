import { Box, Stack, Typography, Skeleton } from "@mui/material";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import Image from "next/image";

export default function PayCardHeader({ courseDetails }) {
  const isLoading = !courseDetails;

  return (
    <Box>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={250}
            sx={{ borderRadius: "10px" }}
          />
        ) : (
          <Image
            src={courseDetails?.thumbnail || defaultThumbnail}
            alt="Course Thumbnail"
            width={370}
            height={250}
            style={{ borderRadius: "10px", width: "100%", height: "auto" }}
          />
        )}
      </Stack>

      {/* Course Title */}
      <Stack sx={{ paddingTop: "10px", display: { sm: "none", md: "block" } }}>
        {isLoading ? (
          <Skeleton variant="text" width="80%" height={24} />
        ) : (
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
            }}
          >
            {courseDetails?.title}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
