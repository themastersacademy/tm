"use client";
import { useState } from "react";
import { Drawer, IconButton, Stack, Button, Typography } from "@mui/material";
import { TuneRounded } from "@mui/icons-material";
import StyledSelect from "../StyledSelect/StyledSelect";

export default function MobileFilter() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    goals: "",
    exams: "",
    dateRange: "",
  });

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const handleClearAll = () => {
    setFilters({ goals: "", exams: "", dateRange: "" });
  };
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const options = [
    { label: "ECE", id: "ece" },
    { label: "CSE", id: "cse" },
  ];

  return (
    <>
      <IconButton onClick={openDrawer}>
        <TuneRounded sx={{ color: "var(--text2)" }} />
      </IconButton>

      <Drawer
        anchor="bottom"
        open={open}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            borderRadius: "15px 15px 0 0",
            padding: "20px",
            backgroundColor: "var(--white)",
            maxWidth: "500px",
            margin: "auto",
            width: "100%",
          },
        }}
      >
        <Stack spacing={2}>
          <Typography fontWeight="bold" textAlign="center">
            Filters
          </Typography>
          <StyledSelect
            title="Sort by goals"
            value={filters.goals}
            onChange={(e) => handleFilterChange("goals", e.target.value)}
            displayEmpty
            fullWidth
            size="small"
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              fontSize: { xs: "14px", sm: "16px" },
              padding: { xs: "8px", sm: "10px" },
              maxHeight: "40px",
            }}
            getLabel={(option) => option.label}
            getValue={(option) => option.id}
            options={[
              { label: "ECE", id: "ece" },
              { label: "CSE", id: "cse" },
            ]}
          ></StyledSelect>
          <StyledSelect
            title="Sort by exams"
            value={filters.exams}
            onChange={(e) => handleFilterChange("exams", e.target.value)}
            displayEmpty
            fullWidth
            getLabel={(option) => option.label}
            getValue={(option) => option.id}
            options={[
              { label: "Mock", id: "mock" },
              { label: "Practice", id: "practice" },
            ]}
          ></StyledSelect>
          <StyledSelect
            title="Select date range"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            displayEmpty
            getLabel={(option) => option.label}
            getValue={(option) => option.id}
            options={[
              { label: "Last 7 days", id: "last7days" },
              { label: "Last 30 days", id: "last30days" },
            ]}
            fullWidth
          ></StyledSelect>

          <Stack flexDirection="row" gap={2} justifyContent="center" mt={2}>
            <Button
              variant="outlined"
              onClick={handleClearAll}
              sx={{
                borderRadius: "8px",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                flexGrow: 1,
                borderColor: "var(--primary-color)",
                color: "var(--primary-color)",
                fontSize: { xs: "12px", sm: "14px" },
              }}
            >
              Clear all
            </Button>
            <Button
              variant="contained"
              onClick={closeDrawer}
              sx={{
                borderRadius: "8px",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                flexGrow: 1,
                backgroundColor: "var(--primary-color)",
                fontSize: { xs: "12px", sm: "14px" },
              }}
              disableElevation
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
