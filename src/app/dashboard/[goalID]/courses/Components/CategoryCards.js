"use client";
import { Stack, Typography, Box } from "@mui/material";
import {
  School,
  TrendingUp,
  EmojiEvents,
  AutoStories,
} from "@mui/icons-material";

export default function CategoryCards({ categories = [], onCategoryClick }) {
  const defaultCategories = [
    {
      id: "beginner",
      name: "Beginner Friendly",
      icon: School,
      color: "#4CAF50",
      bgColor: "#E8F5E9",
      count: 0,
    },
    {
      id: "popular",
      name: "Most Popular",
      icon: TrendingUp,
      color: "#FF9800",
      bgColor: "#FFF3E0",
      count: 0,
    },
    {
      id: "advanced",
      name: "Advanced",
      icon: EmojiEvents,
      color: "#F44336",
      bgColor: "#FFEBEE",
      count: 0,
    },
    {
      id: "all",
      name: "All Courses",
      icon: AutoStories,
      color: "#2196F3",
      bgColor: "#E3F2FD",
      count: 0,
    },
  ];

  const categoriesToShow =
    categories.length > 0 ? categories : defaultCategories;

  return (
    <Stack gap="16px" width="100%">
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text1)",
        }}
      >
        Browse by Category
      </Typography>

      <Stack direction="row" gap="16px" flexWrap="wrap">
        {categoriesToShow.map((category) => {
          const IconComponent = category.icon;

          return (
            <Box
              key={category.id}
              onClick={() => onCategoryClick && onCategoryClick(category.id)}
              sx={{
                flex: { xs: "1 1 calc(50% - 8px)", sm: "1 1 calc(25% - 12px)" },
                minWidth: { xs: "calc(50% - 8px)", sm: "140px" },
                maxWidth: { xs: "calc(50% - 8px)", sm: "200px" },
                padding: "20px",
                backgroundColor: category.bgColor || "var(--white)",
                borderRadius: "16px",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  borderColor: category.color,
                },
              }}
            >
              <Stack gap="12px" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <IconComponent
                    sx={{
                      fontSize: 28,
                      color: category.color,
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text1)",
                    lineHeight: 1.3,
                  }}
                >
                  {category.name}
                </Typography>

                {category.count > 0 && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "var(--text3)",
                      fontWeight: 600,
                    }}
                  >
                    {category.count} courses
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}
