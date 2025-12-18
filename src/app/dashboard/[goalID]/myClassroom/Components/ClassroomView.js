"use client";
import { Search, School, East, Add, Class } from "@mui/icons-material";
import {
  Button,
  Stack,
  Typography,
  Box,
  InputAdornment,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import SecondaryCardSkeleton from "@/src/Components/SkeletonCards/SecondaryCardSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import LinearProgressLoading from "@/src/Components/LinearProgressLoading/LinearProgressLoading";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import { useClassrooms } from "@/src/app/context/ClassroomProvider";
import JoinClassroomDialog from "./JoinClassroomDialog";

import { useSnackbar } from "notistack";

export default function ClassroomView() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogOpen = () => setIsDialogOpen(true);
  const dialogClose = () => setIsDialogOpen(false);
  const [localLoading, setLocalLoading] = useState(false);
  const params = useParams();
  const goalID = params.goalID;
  const { classrooms, loading, refetchClassrooms } = useClassrooms();

  const [searchTerm, setSearchTerm] = useState("");

  // Roll No Edit State
  const [editRollMeta, setEditRollMeta] = useState({
    isOpen: false,
    batchID: null,
    rollNo: "",
  });
  const [updatingRoll, setUpdatingRoll] = useState(false);

  const handleEditRollNo = (batchID, currentRollNo) => {
    setEditRollMeta({
      isOpen: true,
      batchID,
      rollNo: currentRollNo || "",
    });
  };

  const handleCloseEditRoll = () => {
    setEditRollMeta({ isOpen: false, batchID: null, rollNo: "" });
  };

  const saveRollNo = async () => {
    if (!editRollMeta.rollNo.trim()) {
      enqueueSnackbar("Please enter a roll number", { variant: "warning" });
      return;
    }
    setUpdatingRoll(true);
    try {
      const res = await fetch("/api/my-classroom/update-roll-no", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchID: editRollMeta.batchID,
          rollNo: editRollMeta.rollNo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        enqueueSnackbar("Roll Number updated successfully", {
          variant: "success",
        });
        refetchClassrooms();
        handleCloseEditRoll();
      } else {
        enqueueSnackbar(data.message || "Failed to update", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error occurred", { variant: "error" });
    } finally {
      setUpdatingRoll(false);
    }
  };

  const filteredClassrooms = useMemo(() => {
    if (!searchTerm) return classrooms;
    return classrooms.filter(
      (item) =>
        item.batchMeta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchMeta.instituteMeta.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [classrooms, searchTerm]);

  return (
    <Stack width="100%" alignItems="center">
      {localLoading && <LinearProgressLoading />}
      {loading ? (
        <PageSkeleton />
      ) : (
        <Stack
          padding={{ xs: 1, md: 4 }}
          gap={3}
          sx={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            marginBottom: "60px",
          }}
        >
          {/* Hero Section */}
          <Stack
            sx={{
              background:
                "linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%)",
              borderRadius: "16px",
              padding: { xs: "20px", md: "40px" },
              color: "white",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(37, 99, 235, 0.15)",
              minHeight: { xs: "auto", md: "200px" },
              justifyContent: "center",
            }}
          >
            {/* Decorative Circles */}
            <Box
              sx={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "250px",
                height: "250px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "-30px",
                left: "10%",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
              }}
            />

            <Stack
              direction={{ xs: "column", md: "row" }}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
              gap={3}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Stack gap={1}>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "var(--font-geist-sans)",
                    fontWeight: 800,
                    fontSize: { xs: "28px", md: "36px" },
                    lineHeight: 1.2,
                  }}
                >
                  My Classroom
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: { xs: "14px", md: "16px" },
                    opacity: 0.9,
                    fontWeight: 500,
                    maxWidth: "500px",
                  }}
                >
                  Manage your enrolled batches, track your progress, and access
                  your study materials all in one place.
                </Typography>
                <Stack direction="row" gap={2} mt={1}>
                  <Chip
                    icon={
                      <Class
                        sx={{
                          color: "white !important",
                          fontSize: "16px !important",
                        }}
                      />
                    }
                    label={`${classrooms.length} Active Batches`}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontFamily: "var(--font-geist-sans)",
                      fontWeight: 600,
                      border: "none",
                    }}
                  />
                </Stack>
              </Stack>

              <Button
                variant="contained"
                onClick={dialogOpen}
                startIcon={<Add />}
                sx={{
                  textTransform: "none",
                  backgroundColor: "white",
                  color: "var(--primary-color)",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 700,
                  fontSize: "15px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                  transition: "all 0.2s ease",
                }}
                disableElevation
              >
                Join New Batch
              </Button>
            </Stack>
          </Stack>

          {/* Search and Filter */}
          <Stack direction="row" gap={2}>
            <TextField
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "var(--text2)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "var(--white)",
                  fontFamily: "var(--font-geist-sans)",
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
          </Stack>

          {/* Grid Layout for Classrooms */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(auto-fill, minmax(350px, 1fr))",
              },
              gap: 3,
              width: "100%",
            }}
          >
            {!loading ? (
              filteredClassrooms.length > 0 ? (
                filteredClassrooms.map((item, index) => (
                  <Stack
                    key={index}
                    onClick={() => {
                      router.push(
                        `/dashboard/${goalID}/myClassroom/${item.batchID}`
                      );
                    }}
                    sx={{
                      backgroundColor: "var(--white)",
                      borderRadius: "20px",
                      padding: "24px",
                      border: "1px solid var(--border-color)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                        borderColor: "var(--primary-color)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "6px",
                        background:
                          "linear-gradient(90deg, var(--primary-color) 0%, var(--sec-color) 100%)",
                      }}
                    />

                    <Stack gap={2}>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "var(--bg-color)",
                            color: "var(--primary-color)",
                          }}
                        >
                          <School />
                        </Stack>
                        <Stack>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-geist-sans)",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "var(--text2)",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {item.batchMeta.instituteMeta.title}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: "var(--font-geist-sans)",
                              fontWeight: 700,
                              fontSize: "18px",
                              color: "var(--text1)",
                              lineHeight: 1.3,
                            }}
                          >
                            {item.batchMeta.title}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Typography
                        sx={{
                          fontFamily: "var(--font-geist-sans)",
                          fontSize: "14px",
                          color: "var(--text2)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "42px",
                        }}
                      >
                        Access your scheduled exams, study materials, and track
                        your performance for this batch.
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          backgroundColor: "var(--bg-color)",
                          padding: "8px 12px",
                          borderRadius: "8px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "var(--font-geist-sans)",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--text2)",
                          }}
                        >
                          Roll No:{" "}
                          <span style={{ color: "var(--text1)" }}>
                            {item.rollNo || "Not Set"}
                          </span>
                        </Typography>
                        <Button
                          size="small"
                          sx={{
                            minWidth: "auto",
                            padding: "4px",
                            color: "var(--primary-color)",
                            fontSize: "12px",
                            textTransform: "none",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditRollNo(item.batchID, item.rollNo);
                          }}
                        >
                          Edit
                        </Button>
                      </Stack>

                      <Button
                        variant="outlined"
                        endIcon={<East />}
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderRadius: "10px",
                          fontFamily: "var(--font-geist-sans)",
                          fontWeight: 600,
                          fontSize: "14px",
                          padding: "10px",
                          borderColor: "var(--border-color)",
                          color: "var(--text1)",
                          marginTop: "auto",
                          "&:hover": {
                            borderColor: "var(--primary-color)",
                            backgroundColor: "var(--bg-color)",
                            color: "var(--primary-color)",
                          },
                        }}
                      >
                        Enter Classroom
                      </Button>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Stack
                  gridColumn="1 / -1"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="300px"
                >
                  <NoDataFound
                    info={
                      searchTerm
                        ? "No classrooms found matching your search."
                        : "You haven't joined any classrooms yet."
                    }
                  />
                </Stack>
              )
            ) : (
              <>
                <SecondaryCardSkeleton fullWidth />
                <SecondaryCardSkeleton fullWidth />
                <SecondaryCardSkeleton fullWidth />
              </>
            )}
          </Box>

          <JoinClassroomDialog
            isDialogOpen={isDialogOpen}
            dialogClose={dialogClose}
            classrooms={classrooms}
            refetchClassrooms={refetchClassrooms}
            localLoading={localLoading}
            setLocalLoading={setLocalLoading}
          />

          {/* Edit Roll No Dialog */}
          <Dialog
            open={editRollMeta.isOpen}
            onClose={handleCloseEditRoll}
            PaperProps={{
              sx: {
                borderRadius: "12px",
                padding: "12px",
                width: "100%",
                maxWidth: "400px",
              },
            }}
          >
            <DialogTitle
              sx={{ fontFamily: "var(--font-geist-sans)", fontWeight: 700 }}
            >
              Update Roll Number
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Roll Number"
                fullWidth
                variant="outlined"
                value={editRollMeta.rollNo}
                onChange={(e) =>
                  setEditRollMeta((prev) => ({
                    ...prev,
                    rollNo: e.target.value,
                  }))
                }
                sx={{ mt: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseEditRoll}
                sx={{ color: "var(--text2)" }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveRollNo}
                variant="contained"
                disabled={updatingRoll}
                sx={{
                  backgroundColor: "var(--primary-color)",
                  textTransform: "none",
                }}
              >
                {updatingRoll ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      )}
    </Stack>
  );
}
