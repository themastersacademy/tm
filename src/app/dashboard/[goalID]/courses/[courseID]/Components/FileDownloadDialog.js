import { SaveAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  Typography,
} from "@mui/material";

export default function FileDownloadDialog({
  isOpen,
  onClose,
  lessonID,
  courseID,
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Slide}
      PaperProps={{ sx: { borderRadius: "15px", padding: "10px" } }}
      disableScrollLock
      sx={{
        "& .MuiDialog-paper": { width: "300px" },
      }}
    >
      <DialogTitle>
        <Stack alignItems="center" gap="10px">
          <Stack
            sx={{
              color: "var(--sec-color)",
              backgroundColor: "#FBF3F3",
              padding: "15px",
              borderRadius: "50px",
            }}
          >
            <SaveAlt />
          </Stack>
          <Typography sx={{ fontSize: "20px" }}>Download File</Typography>
        </Stack>
      </DialogTitle>
      <DialogActions>
        <Stack
          flexDirection="row"
          gap="20px"
          width="100%"
          justifyContent="center"
        >
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "var(--primary-color)",
            }}
            disableElevation
          >
            Download
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              borderColor: "var(--border-color)",
              color: "var(--text4)",
            }}
            onClick={onClose}
            disableElevation
          >
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
