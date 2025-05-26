import { Drawer, Stack, IconButton, Typography } from "@mui/material";
import { Close, ListRounded } from "@mui/icons-material";
import { useState } from "react";
import GoalContents from "./GoalContents";

export default function MobileSidebar({
  onClick,
  blogList,
  selectedBlog,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <IconButton
        sx={{
          position: "fixed",
          bottom: 70,
          right: 12,
          display: { xs: "flex", md: "none" },
          backgroundColor: "var(--primary-color)",
          color: "white",
        }}
        onClick={() => setSidebarOpen(true)}
      >
        <ListRounded sx={{ transform: "rotate(180deg)" }} />
      </IconButton>

      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Stack width="300px" padding="20px">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontFamily="Lato" fontSize="16px" fontWeight="700">
              Contents
            </Typography>
            <IconButton onClick={() => setSidebarOpen(false)}>
              <Close />
            </IconButton>
          </Stack>

          <GoalContents
            onClick={onClick}
            blogList={blogList}
            selectedBlog={selectedBlog}
          />
        </Stack>
      </Drawer>
    </>
  );
}
