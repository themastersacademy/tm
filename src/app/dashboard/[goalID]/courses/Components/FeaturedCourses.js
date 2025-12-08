"use client";
import { Stack, Typography, Box, Button, Chip } from "@mui/material";
import { TrendingUp, People, Star } from "@mui/icons-material";
import Image from "next/image";
import defaultThumbnail from "@/public/images/defaultThumbnail.svg";

export default function FeaturedCourses({ courses = [], onCourseClick }) {
  const featuredCourses = courses
    .filter((course) => course.featured || course.popular)
    .slice(0, 3);

  if (featuredCourses.length === 0) return null;

  return (
    <Stack gap="16px" width="100%">
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text1)",
          }}
        >
          Featured Courses
        </Typography>
        <Chip
          icon={<TrendingUp sx={{ fontSize: 16 }} />}
          label="Popular"
          size="small"
          sx={{
            backgroundColor: "var(--sec-color-acc-2)",
            color: "var(--sec-color)",
            fontWeight: 600,
          }}
        />
      </Stack>

      <Stack direction="row" gap="16px" flexWrap="wrap">
        {featuredCourses.map((course) => (
          <Box
            key={course.id}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 calc(33.333% - 11px)" },
              maxWidth: { xs: "100%", md: "calc(33.333% - 11px)" },
              backgroundColor: "var(--white)",
              borderRadius: "16px",
              overflow: "hidden",
              border: "2px solid var(--primary-color)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              position: "relative",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              },
            }}
          >
            {/* Featured Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "var(--primary-color)",
                color: "white",
                padding: "4px 0",
                textAlign: "center",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                zIndex: 2,
              }}
            >
              FEATURED COURSE
            </Box>

            {/* Thumbnail */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "180px",
                backgroundColor: "#f5f5f5",
                marginTop: "24px",
              }}
            >
              <Image
                src={course.thumbnail || defaultThumbnail.src}
                alt={course.title}
                fill
                style={{ objectFit: "cover" }}
              />

              {/* Rating Badge */}
              {course.rating && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <Star sx={{ fontSize: 14, color: "#FFD700" }} />
                  {course.rating}
                </Box>
              )}
            </Box>

            {/* Content */}
            <Stack padding="20px" gap="14px">
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text1)",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: "48px",
                }}
              >
                {course.title}
              </Typography>

              {course.description && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: "var(--text3)",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {course.description}
                </Typography>
              )}

              {/* Stats */}
              <Stack direction="row" gap="16px" alignItems="center">
                {course.enrolledCount && (
                  <Stack direction="row" alignItems="center" gap="4px">
                    <People sx={{ fontSize: 16, color: "var(--text3)" }} />
                    <Typography
                      sx={{ fontSize: "12px", color: "var(--text3)" }}
                    >
                      {course.enrolledCount.toLocaleString()} students
                    </Typography>
                  </Stack>
                )}
                {course.lessons && (
                  <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
                    {course.lessons} lessons
                  </Typography>
                )}
              </Stack>

              <Button
                variant="contained"
                fullWidth
                onClick={() => onCourseClick(course.id)}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  textTransform: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  fontWeight: 600,
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "var(--primary-color-dark)",
                  },
                }}
              >
                View Course Details
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
