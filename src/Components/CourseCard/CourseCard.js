"use client";
import { Circle, ShoppingBagRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";

export default function CourseCard({
  title = "Untitled Course",
  thumbnail,
  Language = [],
  lessons = "0 Lessons",
  hours = "0 Hours",
  actionButton = null,
  actionMobile = null,
}) {
  const imageSrc = thumbnail || defaultThumbnail.src;

  return (
    <Stack
      width={{ xs: "100%", sm: "202px" }}
      minHeight={{ xs: "170px", md: "220px" }}
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
      }}
    >
      <Stack
        flexDirection={{ xs: "row", sm: "column" }}
        height="100%"
      >
        <Stack sx={{ display: { xs: "none", sm: "flex" } }}>
          <Image
            src={imageSrc}
            alt="Course Thumbnail"
            width="200"
            height="137"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        </Stack>
        <Stack sx={{ display: { xs: "flex", sm: "none" }, padding: "10px" }}>
          <Image
            src={imageSrc}
            alt="Course Thumbnail"
            width="160"
            height="120"
            style={{
              borderRadius: "10px",
            }}
          />
        </Stack>
        <Stack padding="20px 10px" gap="6px">
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
          >
            {title}
          </Typography>
          <Stack direction="row" gap="4px" flexWrap="wrap">
            {Language.map((lang, idx) => (
              <Button
                key={idx}
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: "var(--sec-color-acc-1)",
                  color: "var(--sec-color)",
                  fontSize: "10px",
                  fontFamily: "Lato",
                  textTransform: "none",
                  minWidth: "unset",
                  height: 20,
                  px: 1,
                }}
              >
                {lang}
              </Button>
            ))}
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography fontSize={12} fontFamily="Lato">
              {lessons}
            </Typography>
            <Circle sx={{ fontSize: 8, color: "var(--border-color)" }} />
            <Typography fontSize={12} fontFamily="Lato">
              {hours}
            </Typography>
          </Stack>
          <Stack sx={{ display: { xs: "none", sm: "flex" } }}>
            {actionButton}
          </Stack>
        </Stack>
      </Stack>
      {actionMobile && (
        <Stack sx={{ display: { xs: "flex", sm: "none" } }}>
          {actionMobile}
        </Stack>
      )}
    </Stack>
  );
}
