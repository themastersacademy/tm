"use client";
import { useState } from "react";
import {
  Stack,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import DeleteDialogBox from "@/src/Components/DeleteDialogBox/DeleteDialogBox";

export default function ProAddressCard({
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
      <Stack
        backgroundColor={isSelected ? "#EFFDF3" : "var(--white)"}
        border={
          isSelected
            ? "2px solid var(--primary-color)"
            : "1px solid var(--border-color)"
        }
        padding="20px"
        borderRadius="8px"
        sx={{ cursor: "pointer", marginBottom: "20px" }}
        onClick={handleToggleSelect}
        width="100%"
      >
        {/* Address Header */}
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Checkbox
              checked={isSelected}
              onChange={handleToggleSelect}
              onClick={(e) => e.stopPropagation()}
              sx={{
                color: "var(--primary-color)",
                "&.Mui-checked": {
                  color: "var(--primary-color)",
                },
              }}
            />
            <Typography
              sx={{ color: "var(--primary-color)", fontWeight: "bold" }}
            >
              {title}
            </Typography>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(billingInfo, index);
              }}
            >
              <Edit sx={{ color: "var(--primary-color)" }} />
            </IconButton>
          </Stack>
          <Stack>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{ color: "var(--primary-color)" }}
                />
              ) : (
                <Delete sx={{ color: "var(--delete-color)" }} />
              )}
            </IconButton>
          </Stack>
        </Stack>
        {/* Address Details */}
        <Stack sx={{ marginTop: "20px" }}>
          <Typography>
            {billingInfo.firstName} {billingInfo.lastName}
          </Typography>
          <Typography>{billingInfo.phone}</Typography>
          <Typography>{billingInfo.address}</Typography>
          <Typography>
            {billingInfo.city}, {billingInfo.state}, {billingInfo.zip}
          </Typography>
        </Stack>
      </Stack>
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
              sx={{ backgroundColor: "var(--delete-color)" }}
              disabled={loading}
            >
              Confirm
            </Button>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              sx={{ color: "black", borderColor: "black" }}
              disabled={loading}
            >
              Cancel
            </Button>
          </Stack>
        }
        name={`${billingInfo.firstName} ${billingInfo.lastName}`}
        title="Delete Address"
        warning="Are you sure you want to delete this address?"
      />
    </>
  );
}
