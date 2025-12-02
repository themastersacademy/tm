import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";

export default function DialogBox({
  children,
  isOpen = "",
  title = "",
  icon = "",
  actionButton = "",
  sx = {},
}) {
  return (
    <Dialog
      open={isOpen}
      disableScrollLock={true}
      TransitionComponent={Slide}
      sx={{
        "& .MuiDialog-paper": {
          width: "600px",
          maxWidth: { xs: "95%", md: "600px" },
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "var(--border-color)",
          padding: "0px",
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1)",
          ...sx,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-geist-sans)",
          fontSize: "20px",
          fontWeight: "700",
          padding: { xs: "20px", md: "24px 24px 0px 24px" },
          color: "var(--text1)",
        }}
      >
        {title}
        {icon}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px !important", ...sx }}>
        {children}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "0 24px 24px 24px" }}
      >
        <Stack width="100%">{actionButton || ""}</Stack>
      </DialogActions>
    </Dialog>
  );
}
