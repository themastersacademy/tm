"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";

export default function PolicyDialog({ open, onClose, title, content }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-color)",
          padding: "16px 24px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Lato",
            fontWeight: 700,
            fontSize: "20px",
            color: "var(--text1)",
          }}
        >
          {title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <Typography
          component="div"
          sx={{
            fontFamily: "Lato",
            color: "var(--text2)",
            lineHeight: 1.6,
            "& strong": {
              color: "var(--text1)",
              display: "block",
              marginTop: "16px",
              marginBottom: "8px",
            },
          }}
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: "1px solid var(--border-color)",
          padding: "16px 24px",
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "var(--primary-color)",
            textTransform: "none",
            fontFamily: "Lato",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "var(--primary-color-dark)",
            },
          }}
        >
          I Understand
        </Button>
      </DialogActions>
    </Dialog>
  );
}
