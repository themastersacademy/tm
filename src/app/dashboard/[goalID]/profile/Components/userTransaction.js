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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

export default function UserTransaction({ userID }) {
  const { enqueueSnackbar } = useSnackbar();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const validTransactions = data.data.filter((tx) => {
          if (!tx.status) {
            console.warn("Invalid transaction found:", tx);
            return false;
          }
          return true;
        });
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
        
      default:
        return { backgroundColor: "var(--text3)" }; // Fallback for unknown status
    }
  };

  const formatStatusLabel = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Stack gap="20px" sx={{ p: 2 }}>
      <Typography
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
          <Typography sx={{ fontFamily: "Lato", color: "var(--text3)" }}>
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
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Transaction ID
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Created Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="rectangular" width={100} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={80} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={60} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={120} height={20} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={140} height={20} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : transactions.length === 0 ? (
        <Typography sx={{ fontFamily: "Lato", color: "var(--text3)" }}>
          {/* No payments found. */}
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "10px", boxShadow: "none" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="transaction table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Transaction ID
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Created Date
                </TableCell>
                <TableCell sx={{ fontFamily: "Lato", fontWeight: "700" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.pKey}>
                  <TableCell sx={{ fontFamily: "Lato" }}>
                    {tx.pKey.split("#")[1].slice(0, 8)}...
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Lato" }}>
                    ₹{tx.amount}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Lato" }}>
                    {tx.order?.id || "N/A"}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Lato" }}>
                    {new Date(tx.createdAt).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatusLabel(tx.status)}
                      sx={{
                        ...getStatusStyles(tx.status),
                        fontFamily: "Lato",
                        color: "#fff", // Ensure text is readable; adjust if needed
                      }}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
