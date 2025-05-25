"use client";
import { Stack, Typography, Box, Divider } from "@mui/material";

export default function GoalContents({ blogList, onClick, selectedBlog }) {
  return (
    <Box
      sx={{
        backgroundColor: "var(--white)",
        borderRadius: "10px",
        padding: "10px 0",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      <Stack spacing={0}>
        {blogList.map((item, index) => {
          const isActive = selectedBlog?.blogID === item.blogID;
          return (
            <Box key={item.blogID}>
              <Box
                key={item.blogID}
                onClick={() => onClick(item.blogID)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  cursor: "pointer",
                  backgroundColor: isActive
                    ? "var(--primary-color-acc-2)"
                    : "transparent",
                  borderLeft: isActive
                    ? "3px solid var(--primary-color)"
                    : "1px solid var(--border-color)",
                  transition: "background 0.2s ease",
                  width: "100%",
                }}
              >
                <Typography
                  key={item.blogID}
                  fontSize="14px"
                  fontFamily="Lato"
                  fontWeight="700"
                  color={isActive ? "var(--primary-color)" : "var(--text1)"}
                >
                  {item.title}
                </Typography>
              </Box>
              {index !== blogList.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
