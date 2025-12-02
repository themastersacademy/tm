"use client";
import { useState } from "react";
import {
  Stack,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Radio,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DeleteDialogBox from "@/src/Components/DeleteDialogBox/DeleteDialogBox";

export default function AddressCard({
  billingInfo,
  title,
  onEdit,
  index,
  onDelete,
  isSelected,
  onSelect,
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      await onDelete(index);
      setIsDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleToggleSelect = () => {
    onSelect(index);
  };

  return (
    <>
      <Box
        onClick={handleToggleSelect}
        sx={{
          p: 3,
          borderRadius: "16px",
          bgcolor: isSelected ? "var(--primary-color-acc-2)" : "var(--white)",
          border: "1px solid",
          borderColor: isSelected
            ? "var(--primary-color)"
            : "var(--border-color)",
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: "var(--primary-color)",
            bgcolor: isSelected
              ? "var(--primary-color-acc-2)"
              : "var(--library-expand)",
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Stack direction="row" alignItems="flex-start" gap={2}>
          <Radio
            checked={isSelected}
            onChange={handleToggleSelect}
            sx={{
              p: 0,
              mt: 0.5,
              color: "var(--text4)",
              "&.Mui-checked": {
                color: "var(--primary-color)",
              },
            }}
          />

          <Stack flex={1} gap={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {title}
              </Typography>
              <Stack direction="row" gap={1}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(billingInfo, index);
                  }}
                  sx={{
                    color: "var(--text3)",
                    "&:hover": { color: "var(--primary-color)" },
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick();
                  }}
                  sx={{
                    color: "var(--text3)",
                    "&:hover": { color: "var(--delete-color)" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <Delete fontSize="small" />
                  )}
                </IconButton>
              </Stack>
            </Stack>

            <Stack gap={0.5}>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--text2)",
                }}
              >
                {billingInfo.firstName} {billingInfo.lastName}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "var(--text3)" }}>
                {billingInfo.address}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "var(--text3)" }}>
                {billingInfo.city}, {billingInfo.state} - {billingInfo.zip}
              </Typography>
              <Typography
                sx={{ fontSize: "14px", color: "var(--text3)", mt: 0.5 }}
              >
                Phone: {billingInfo.phone}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <DeleteDialogBox
        isOpen={isDeleteDialogOpen}
        actionButton={
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            width="100%"
          >
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              sx={{
                bgcolor: "var(--delete-color)",
                "&:hover": { bgcolor: "#b91c1c" },
                textTransform: "none",
              }}
              disabled={loading}
            >
              Delete Address
            </Button>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{
                color: "var(--text2)",
                borderColor: "var(--border-color)",
                textTransform: "none",
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        }
        name={`${billingInfo.firstName} ${billingInfo.lastName}`}
        title="Delete Address"
        warning="Are you sure you want to delete this address? This action cannot be undone."
      />
    </>
  );
}
