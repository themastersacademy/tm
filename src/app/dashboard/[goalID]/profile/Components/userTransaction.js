import {
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export default function UserTransaction({ userID }) {
  const { enqueueSnackbar } = useSnackbar();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchTransactions = async () => {
    if (!userID) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/user-transaction`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        const validTransactions = data.data.filter((tx) => tx.status);
        const sortedTransactions = validTransactions.sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setTransactions(sortedTransactions);
      } else {
        throw new Error(data.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Fetch transactions error:", error);
      setError(error.message);
      enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userID]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "var(--primary-color)" };
      case "pending":
        return { backgroundColor: "var(--sec-color)" };
      case "failed":
        return { backgroundColor: "var(--delete-color)" };
      case "cancelled":
        return { backgroundColor: "var(--text4)" };
      case "refunded":
        return { backgroundColor: "red" };
      default:
        return { backgroundColor: "var(--text3)" };
    }
  };

  const formatStatusLabel = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Stack gap="20px" sx={{ p: { xs: 0, sm: 2 } }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: "Lato",
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--text4)",
        }}
      >
        Payment History
      </Typography>

      {error ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          gap="20px"
        >
          <Typography
            component="div"
           sx={{ fontFamily: "Lato", color: "var(--text3)" }}>
            {error}
          </Typography>
        </Stack>
      ) : loading ? (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "10px", boxShadow: "none" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="transaction table">
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Created Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  {[...Array(4)].map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton variant="rectangular" width={100} height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : transactions.length === 0 ? (
        <Typography
        component="div"
         sx={{ fontFamily: "Lato", color: "var(--text3)" }}>
          No payments found.
        </Typography>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="desktop-view">
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "10px", boxShadow: "none" }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="transaction table">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.pKey}>
                      <TableCell>{tx.order?.id || "N/A"}</TableCell>
                      <TableCell>₹{tx.amount}</TableCell>
                      <TableCell>
                        {new Date(tx.createdAt).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatusLabel(tx.status)}
                          sx={{
                            ...getStatusStyles(tx.status),
                            fontFamily: "Lato",
                            color: "#fff",
                            fontWeight: "700",
                            height: "30px",
                            width: "100px",
                            borderRadius: "5px",
                          }}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-view">
            <Stack gap={2}>
              {transactions.map((tx) => (
                <Paper key={tx.pKey} sx={{ p: 2, borderRadius: 1 }}>
                  <Typography
                    component="div"
                   sx={{ fontWeight: 700 }}>
                    Amount: ₹{tx.amount}
                  </Typography>
                  <Stack
                    // always row on xs (and up), center-aligned vertically
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1} // vertical spacing above both
                    spacing={1} // horizontal gap between chip & button
                  >
                    <Chip
                      label={formatStatusLabel(tx.status)}
                      sx={{
                        ...getStatusStyles(tx.status),
                        fontFamily: "Lato",
                        color: "#fff",
                        fontWeight: "700",
                        height: "30px",
                        width: "100px",
                        borderRadius: "5px",
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setOpenDialog(true);
                      }}
                      sx={{
                        backgroundColor: "transparent",
                        color: "var(--sec-color)",
                        borderColor: "transparent",
                        textTransform: "none",
                        width: "auto",
                        fontSize: "12px",
                        "@media (max-width: 400px)": {
                          width: "auto",
                          fontSize: "10px",
                        },
                      }}
                    >
                      View More
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </div>

          {/* Popup Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle
              sx={{
                backgroundColor: "var(--sec-color-acc-1)",
                color: "var(--sec-color)",
              }}
            >
              Transaction Details
              <IconButton
                aria-label="close"
                onClick={() => setOpenDialog(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              {selectedTransaction && (
                <Stack gap={2}>
                  <Typography
                  component="div"
                  >
                    <strong>Order ID:</strong>{" "}
                    {selectedTransaction.order?.id || "N/A"}
                  </Typography>
                  <Typography
                  component="div"
                  >
                    <strong>Created Date:</strong>{" "}
                    {new Date(selectedTransaction.createdAt).toLocaleString(
                      "en-IN"
                    )}
                  </Typography>
                  <Typography
                  component="div"
                    >
                    <strong>Amount:</strong> ₹{selectedTransaction.amount}
                  </Typography>
                  <Typography
                  component="div"
                  >
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={formatStatusLabel(selectedTransaction.status)}
                      sx={{
                        ...getStatusStyles(selectedTransaction.status),
                        fontFamily: "Lato",
                        color: "#fff",
                        fontWeight: "700",
                        height: "30px",
                        width: "100px",
                        borderRadius: "5px",
                      }}
                    />
                  </Typography>
                </Stack>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* CSS to control visibility */}
      <style jsx>{`
        .desktop-view {
          display: block;
        }
        .mobile-view {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-view {
            display: none;
          }
          .mobile-view {
            display: block;
          }
        }
      `}</style>
    </Stack>
  );
}
