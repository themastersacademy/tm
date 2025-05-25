"use client";

import { Circle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";

export default function CourseCard({
  title = "Untitled Course",
  thumbnail,
  Language = [],
  lessons = "0 Lessons",
  hours = "0 Hours",
  actionButton = null,
  progress = null,
}) {
  const imageSrc = thumbnail || defaultThumbnail.src;

  return (
    <Card
      sx={{
        width: 200,
        minHeight: 260,
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
      }}
      elevation={0}
    >
      <Box position="relative" width="100%" height={137}>
        <Image
          src={imageSrc}
          alt="Course Thumbnail"
          width={200}
          height={137}
          style={{
            objectFit: "cover",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          priority
        />
        {progress !== null && (
          <CircularProgress
            variant="determinate"
            value={progress}
            size={20}
            sx={{
              color: "var(--sec-color)",
              position: "absolute",
              top: 8,
              right: 8,
            }}
          />
        )}
      </Box>
      <Stack
        sx={{
          padding: 1.25,
          gap: 1,
          height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography fontSize={14} fontWeight={700} fontFamily="Lato">
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
        <Box mt="auto" display="flex" justifyContent="center">
          {actionButton}
        </Box>
      </Stack>
    </Card>
  );
}
