"use client";
import { useState } from "react";
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  IconButton,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import {
  Search,
  GridView,
  ViewList,
  FilterList,
  Close,
} from "@mui/icons-material";

export default function FilterBar({
  searchQuery = "",
  onSearchChange,
  sortBy = "newest",
  onSortChange,
  viewMode = "grid",
  onViewModeChange,
  difficulty = "all",
  onDifficultyChange,
  priceFilter = "all",
  onPriceFilterChange,
  showFilters = true,
  activeFiltersCount = 0,
  onClearFilters,
  showViewToggle = true,
  showStats = false,
  stats = null,
}) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <Stack gap="16px" width="100%">
      {/* Main Filter Bar */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap="12px"
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        sx={{
          padding: "16px",
          backgroundColor: "var(--white)",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "var(--text3)", fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => onSearchChange("")}
                  sx={{ padding: "4px" }}
                >
                  <Close sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              backgroundColor: "var(--bg1)",
              fontSize: "14px",
              "& fieldset": {
                borderColor: "var(--border-color)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-color)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-color)",
              },
            },
          }}
        />

        {/* Right Side Controls */}
        <Stack
          direction="row"
          gap="12px"
          alignItems="center"
          sx={{ minWidth: { xs: "100%", sm: "auto" } }}
        >
          {/* Sort Dropdown */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "50%", sm: "140px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "var(--bg1)",
              },
            }}
          >
            <InputLabel sx={{ fontSize: "14px" }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              label="Sort By"
              sx={{ fontSize: "14px" }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="alphabetical">A-Z</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
              {showStats && <MenuItem value="progress">Progress</MenuItem>}
            </Select>
          </FormControl>

          {/* View Toggle */}
          {showViewToggle && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && onViewModeChange(newMode)}
              size="small"
              sx={{
                backgroundColor: "var(--bg1)",
                borderRadius: "10px",
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: "10px",
                  padding: "8px 12px",
                  color: "var(--text2)",
                  "&.Mui-selected": {
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "var(--primary-color-dark)",
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridView sx={{ fontSize: 20 }} />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList sx={{ fontSize: 20 }} />
              </ToggleButton>
            </ToggleButtonGroup>
          )}

          {/* Filter Toggle Button */}
          {showFilters && (
            <IconButton
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              sx={{
                backgroundColor: showFilterPanel
                  ? "var(--primary-color)"
                  : "var(--bg1)",
                color: showFilterPanel ? "white" : "var(--text2)",
                borderRadius: "10px",
                padding: "10px",
                position: "relative",
                "&:hover": {
                  backgroundColor: showFilterPanel
                    ? "var(--primary-color-dark)"
                    : "var(--bg2)",
                },
              }}
            >
              <FilterList sx={{ fontSize: 20 }} />
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    backgroundColor: "#F44336",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </IconButton>
          )}
        </Stack>
      </Stack>

      {/* Stats Bar (if enabled) */}
      {showStats && stats && (
        <Stack
          direction="row"
          gap="12px"
          flexWrap="wrap"
          sx={{
            padding: "12px 16px",
            backgroundColor: "var(--white)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
          }}
        >
          <Chip
            label={`Total: ${stats.total || 0}`}
            size="small"
            sx={{
              backgroundColor: "var(--sec-color-acc-2)",
              color: "var(--sec-color)",
              fontWeight: 600,
            }}
          />
          {stats.completed !== undefined && (
            <Chip
              label={`Completed: ${stats.completed || 0}`}
              size="small"
              sx={{
                backgroundColor: "#E8F5E9",
                color: "#2E7D32",
                fontWeight: 600,
              }}
            />
          )}
          {stats.inProgress !== undefined && (
            <Chip
              label={`In Progress: ${stats.inProgress || 0}`}
              size="small"
              sx={{
                backgroundColor: "#FFF3E0",
                color: "#E65100",
                fontWeight: 600,
              }}
            />
          )}
          {stats.avgProgress !== undefined && (
            <Chip
              label={`Avg Progress: ${Math.round(stats.avgProgress || 0)}%`}
              size="small"
              sx={{
                backgroundColor: "#E3F2FD",
                color: "#1565C0",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>
      )}

      {/* Expanded Filters Panel */}
      {showFilters && showFilterPanel && (
        <Stack
          gap="16px"
          sx={{
            padding: "20px",
            backgroundColor: "var(--white)",
            borderRadius: "12px",
            border: "1px solid var(--border-color)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} gap="16px">
            {/* Difficulty Filter */}
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            >
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value)}
                label="Difficulty Level"
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            {/* Price Filter */}
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            >
              <InputLabel>Price</InputLabel>
              <Select
                value={priceFilter}
                onChange={(e) => onPriceFilterChange(e.target.value)}
                label="Price"
              >
                <MenuItem value="all">All Courses</MenuItem>
                <MenuItem value="free">Free Only</MenuItem>
                <MenuItem value="pro">PRO Only</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
