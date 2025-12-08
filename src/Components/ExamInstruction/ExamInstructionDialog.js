"use client";
import React from "react";
import DialogBox from "../DialogBox/DialogBox";
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  AccessTime,
  Quiz,
  EmojiEvents,
  CheckCircleOutline,
  Close,
  PlayArrow,
  WarningAmber,
} from "@mui/icons-material";
import Image from "next/image";
import { useTheme, useMediaQuery } from "@mui/material";

export default function ExamInstructionDialog({
  open,
  onClose,
  onStart,
  examData,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!examData) return null;

  const instructions = [
    "Ensure you have a stable internet connection throughout the exam.",
    "Do not refresh the page or switch tabs, as this may submit the exam automatically.",
    "Read all questions carefully before answering.",
    "You can navigate between questions using the question palette.",
    "The timer will start immediately after clicking 'Start Now'.",
  ];

  const StatBox = ({ icon, label, value, color, bgcolor }) => (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{
        bgcolor: bgcolor,
        p: 2,
        borderRadius: "12px",
        flex: 1,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 1,
          borderRadius: "8px",
          display: "flex",
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "var(--text3)" }}>
          {label}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <DialogBox
      isOpen={open}
      onClose={onClose}
      width="600px"
      fullScreen={isMobile}
      title="Exam Instructions"
      icon={
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      }
      actionButton={
        <Button
          variant="contained"
          onClick={onStart}
          endIcon={<PlayArrow />}
          size="large"
          sx={{
            bgcolor: "var(--primary-color)",
            color: "white",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            fontSize: "16px",
            px: 4,
            py: 1.2,
            "&:hover": {
              bgcolor: "var(--primary-color-dark)",
            },
          }}
        >
          Start Now
        </Button>
      }
    >
      <Stack gap={3}>
        {/* Exam Header */}
        <Stack direction="row" gap={2} alignItems="center">
          {examData.icon && (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "16px",
                bgcolor: "var(--sec-color-acc-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Image src={examData.icon} alt="exam" width={32} height={32} />
            </Box>
          )}
          <Box>
            <Typography
              sx={{ fontSize: "20px", fontWeight: 800, color: "var(--text1)" }}
            >
              {examData.title}
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "var(--text3)" }}>
              Read instructions carefully
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 2,
          }}
        >
          <StatBox
            icon={<AccessTime />}
            value={`${examData.duration || 0} mins`}
            label="Duration"
            color="#2196F3"
            bgcolor="#E3F2FD"
          />
          <StatBox
            icon={<Quiz />}
            value={examData.totalQuestions || 0}
            label="Questions"
            color="#9C27B0"
            bgcolor="#F3E5F5"
          />
          <StatBox
            icon={<EmojiEvents />}
            value={examData.totalMarks || 0}
            label="Total Marks"
            color="#FF9800"
            bgcolor="#FFF3E0"
          />
        </Box>

        {/* Instructions List */}
        <Box sx={{ bgcolor: "#F8F9FA", p: 3, borderRadius: "16px" }}>
          <Stack direction="row" alignItems="center" gap={1} mb={2}>
            <WarningAmber sx={{ color: "var(--text2)", fontSize: 20 }} />
            <Typography
              sx={{ fontSize: "14px", fontWeight: 700, color: "var(--text2)" }}
            >
              Important Rules
            </Typography>
          </Stack>
          <List disablePadding>
            {instructions.map((text, index) => (
              <ListItem
                key={index}
                disablePadding
                sx={{ mb: 1.5, alignItems: "flex-start" }}
              >
                <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                  <CheckCircleOutline
                    sx={{ fontSize: 18, color: "var(--primary-color)" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    color: "var(--text3)",
                    lineHeight: 1.5,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Stack>
    </DialogBox>
  );
}
