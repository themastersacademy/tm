"use client";
import React from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const NavigationGuard = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Exit Exam?</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to leave?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm}>End Exam</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NavigationGuard;
