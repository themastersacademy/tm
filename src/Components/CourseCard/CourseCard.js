"use client";
import { Circle } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
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
      maxWidth={{ xs: "400px", sm: "202px" }}
      width={{ xs: "100%", sm: "202px" }}
      minHeight={{ xs: "auto", sm: "320px" }}
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        display: "flex", 
        flexDirection: "column",
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
            height="120"
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
            width="130"
            height="80"
            style={{
              borderRadius: "10px",
            }}
          />
        </Stack>

        {/* Course Info */}
        <Stack padding={{ xs: "10px", sm: "20px 10px" }} gap="6px">
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "12px", sm: "14px" },
              fontWeight: "700",
            }}
          >
            {title}
          </Typography>
          <Stack direction="row" gap="4px" flexWrap="wrap">
            {Language.map((lang, idx) => (
              <Stack
                key={idx}
                sx={{
                  backgroundColor: "var(--sec-color-acc-1)",
                  color: "var(--sec-color)",
                  fontSize: "10px",
                  fontFamily: "Lato",
                  minWidth: "unset",
                  height: 20,
                  px: 1,
                  borderRadius: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {lang}
              </Stack>
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
        </Stack>
      </Stack>

      {/* Action Button - Always at the bottom */}
      {actionButton && (
        <Stack
          sx={{
            display: { xs: "none", sm: "flex" },
            backgroundColor: "var(--primary-color-acc-2)",
            color: "var(--white)",
            borderRadius: "0px 0px 10px 10px",
          }}
        >
          {actionButton}
        </Stack>
      )}

      {/* Mobile Action */}
      {actionMobile && (
        <Stack sx={{ display: { xs: "flex", sm: "none" } }}>
          {actionMobile}
        </Stack>
      )}
    </Stack>
  );
}
