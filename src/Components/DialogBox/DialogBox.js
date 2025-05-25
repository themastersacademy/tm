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
  isOpen="",
  title="",
  icon="",
  actionButton="",
}) {
  return (
    <Dialog
      open={isOpen}
      disableScrollLock={true}
      TransitionComponent={Slide}
      sx={{
        "& .MuiDialog-paper": {
          width: "600px",
          maxWidth: { xs: "100%", md: "600px" },
          borderRadius: "10px",
          border: "1px solid",
          borderColor: "var(--border-color)",
          padding:"0px"
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Lato",
          fontSize: "20px",
          fontWeight: "700",
          padding: {xs:"10px",md:"20px 20px 0px 20px"},
        }}
      >
        {title}
        {icon}
      </DialogTitle>
      <DialogContent sx={{ padding: 0, }}>{children}</DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Stack>{actionButton || ""}</Stack>
      </DialogActions>
    </Dialog>
  );
}
