"use client";
import { memo } from "react";
import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PlayLessonIcon from "@mui/icons-material/PlayLesson";
import StarIcon from '@mui/icons-material/Star';
import { CrownFilled  } from '@ant-design/icons';

const CourseCard = memo(function CourseCard({
  title = "Untitled Course",
  thumbnail,
  Language = [],
  lessons = "0 Lessons",
  hours = "0 Hours",
  actionButton = null,
  actionMobile = null,
  isPro = false,
  isFree = false
}) {
  const imageSrc = thumbnail || defaultThumbnail.src;

  const badgeText = isPro ? "PRO" : isFree ? "FREE" : null;

  return (
    <Stack
      maxWidth={{ xs: "400px", sm: "300px" }}
      width={{ xs: "100%", sm: "260px" }}
      minHeight={{ xs: "auto", sm: "320px" }}
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--white)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Content Area */}
      <Stack
        flexDirection={{ xs: "row", sm: "column" }}
        sx={{ flexGrow: 1 }}
        gap={1}
      >
        {/* Thumbnail */}
        <Stack
          sx={{ display: { xs: "none", sm: "flex" }, position: "relative" }}
        >
          <Image
            src={imageSrc}
            alt="Course Thumbnail"
            width="260"
            height="140"
            loading="lazy"
            style={{
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
          {badgeText && (
            <Stack
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: isPro ? "red" : "var(--primary-color)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "8px",
                fontSize: "12px",
                fontFamily: "Lato",
                fontWeight: "bold",
                width: isFree ? "45px" : "50px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap:0.5
              }}
            >
              {isPro && <CrownFilled />} {badgeText}
            </Stack>
          )}
        </Stack>
        <Stack sx={{ display: { xs: "flex", sm: "none" }, padding: "10px" }}>
          <Image
            src={imageSrc}
            alt="Course Thumbnail"
            width="130"
            height="80"
            loading="lazy"
            style={{ borderRadius: "10px" }}
          />
        </Stack>

        {/* Text Content */}
        <Stack
          sx={{ maxWidth: "100%", overflow: "hidden" }}
          padding={{ xs: "10px", sm: "15px 10px" }}
          gap="6px"
          flexGrow={1}
        >
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "10px", sm: "14px", md: "16px" },
              fontWeight: "bold",
              marginBottom: { xs: "0px", sm: "10px" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </Typography>

          <hr style={{ border: "1px solid var(--border-color)" }} />

          <Stack
            direction="row"
            gap="4px"
            flexWrap="wrap"
            marginTop={{ xs: "4px", sm: "10px" }}
          >
            {Language.map((lang, idx) => (
              <Stack
                key={idx}
                sx={{
                  backgroundColor: "var(--sec-color-acc-1)",
                  color: "var(--sec-color)",
                  fontSize: "10px",
                  fontFamily: "Lato",
                  height: 20,
                  px: 1,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {lang}
              </Stack>
            ))}
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            marginTop={{ xs: "4px", sm: "12px" }}
          >
            <Stack direction="row" gap={1}>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <PlayLessonIcon
                  sx={{ fontSize: 16, color: "var(--primary-color)" }}
                />
                <Typography fontSize={10} fontFamily="Lato">
                  {lessons}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={0.5}>
                <AccessTimeFilledIcon
                  sx={{ fontSize: 16, color: "var(--primary-color)" }}
                />
                <Typography fontSize={10} fontFamily="Lato">
                  {hours}
                </Typography>
              </Stack>
            </Stack>

            {/* Desktop Action Button */}
            {actionButton && (
              <Stack
                sx={{
                  display: { xs: "none", sm: "flex" },
                  backgroundColor: "var(--primary-color)",
                  borderRadius: "5px",
                  padding: "5px 10px",
                }}
              >
                {actionButton}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Mobile Action Button: Full width and no padding */}
      {actionMobile && (
        <Stack
          sx={{
            display: { xs: "flex", sm: "none" },
            width: "100%",
            padding: 0,
            margin: 0,
            backgroundColor: "var(--primary-color)",
            borderRadius: 0,
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          {actionMobile}
        </Stack>
      )}
    </Stack>
  );
});

export default CourseCard;
