"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Stack,
  Typography,
  CircularProgress,
  Button,
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSession } from "next-auth/react";
import ReplayIcon from "@mui/icons-material/Replay";
import MovingIcon from "@mui/icons-material/Moving";
import { enqueueSnackbar } from "notistack";
import PaymentLoadingOverlay from "@/src/Components/PaymentOverlay/PaymentOverlay";

export default function Transaction() {
  const { data: session, status: sessionStatus, update } = useSession();
  const params = useParams();
  const router = useRouter();
  const transactionID = params.id;

  const [status, setStatus] = useState("loading");
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [retryPaymentInfo, setRetryPaymentInfo] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true); // New state to control fetch

  const userID = session?.user?.id;

  const fetchTransactionStatus = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll/transaction-status?transactionID=${transactionID}&userID=${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        const tx = data.data;
        setTransaction(tx);
        setStatus(tx.status || "failed");

        // Only call update if status is completed
        if (tx.status === "completed") {
          update();
        }
      } else {
        throw new Error(data.message || "Failed to fetch transaction");
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    } finally {
      setShouldFetch(false); // Prevent further fetches until needed
    }
  }, [transactionID, userID]);

  useEffect(() => {
    if (
      sessionStatus === "loading" ||
      !transactionID ||
      !userID ||
      !shouldFetch
    ) {
      return;
    }
    fetchTransactionStatus();
  }, [
    transactionID,
    userID,
    sessionStatus,
    shouldFetch,
    fetchTransactionStatus,
  ]);

  const retryPayment = async () => {
    if (!transaction?.order?.id || !transaction?.amount) {
      enqueueSnackbar("Invalid transaction data for retry", {
        variant: "error",
      });
      return;
    }

    try {
      const orderStatusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout/course-enroll/order-status?orderId=${transaction.order.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderStatusData = await orderStatusResponse.json();
      if (
        !orderStatusData.success ||
        !["created", "attempted"].includes(orderStatusData.data.status)
      ) {
        throw new Error("Order is not valid for retry");
      }

      setPaymentLoading(true);
      setRetryPaymentInfo({
        order: transaction.order,
        priceDetails: transaction.amount,
        transactionID: transactionID,
        description: `Retry Payment for Course Enrollment`,
        billingInfo: transaction.billingInfo,
      });
    } catch (error) {
      enqueueSnackbar("Payment retry failed. Please try again.", {
        variant: "error",
      });
    }
  };

  const handlePaymentClose = useCallback(() => {
    setPaymentLoading(false);
    setShouldFetch(true); // Trigger fetch after retry payment
  }, []);

  const renderIcon = () => {
    if (status === "error")
      return <CancelIcon sx={{ color: "red", fontSize: "40px" }} />;
    if (status === "completed")
      return <CheckCircleIcon sx={{ color: "green", fontSize: "40px" }} />;
    if (status === "failed" || status === "created")
      return <CancelIcon sx={{ color: "red", fontSize: "40px" }} />;
    return <CircularProgress sx={{ color: "var(--primary-color)" }} />;
  };

  const amount = transaction?.amount || "N/A";
  const refNumber =
    status === "completed"
      ? transaction?.razorpayPaymentId || "N/A"
      : transaction?.order?.id || "N/A";
  const refLabel = status === "completed" ? "Payment ID" : "Order ID";
  const paymentTime = transaction?.updatedAt
    ? new Date(transaction.updatedAt).toLocaleString("en-IN")
    : "-";
  const method = transaction?.paymentDetails?.method || "-";

  const headline =
    status === "error"
      ? "Error Fetching Transaction"
      : status === "completed"
      ? "Payment Success!"
      : status === "failed" || status === "created"
      ? "Payment Failed!"
      : "Loading Transaction...";

  const message =
    status === "error"
      ? error
      : status === "completed"
      ? "Your payment has been successfully done."
      : status === "failed" || status === "created"
      ? "Your payment has failed. Please try again."
      : "Fetching transaction details...";

  if (status === "loading") {
    return (
      <Stack
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Stack
          sx={{
            backgroundColor: "white",
            padding: 4,
            height: "auto",
            width: { xs: "300px", sm: "450px", md: "450px", lg: "450px" },
            borderTopRightRadius: "25px",
            borderTopLeftRadius: "25px",
          }}
        >
          <Stack display="flex" justifyContent="center" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="text" width={200} sx={{ marginTop: 1 }} />
            <Skeleton variant="text" width={250} sx={{ paddingTop: 2 }} />
            <hr
              style={{
                width: "100%",
                margin: "20px 0",
                borderColor: "var(--border-color)",
              }}
            />
            <Stack
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={120} sx={{ fontSize: "28px" }} />
              <Skeleton variant="text" width={150} sx={{ fontSize: "12px" }} />
            </Stack>
            <Stack
              direction="row"
              gap={2}
              marginTop={4}
              width="100%"
              paddingX={1}
            >
              {[1, 2].map((_, i) => (
                <Stack
                  key={i}
                  sx={{
                    border: "1px solid var(--border-color)",
                    padding: "5px",
                    width: "180px",
                    borderRadius: "5px",
                  }}
                >
                  <Skeleton variant="text" width={80} />
                  <Skeleton variant="text" width={120} />
                </Stack>
              ))}
            </Stack>
            <Stack direction="row" gap={2} justifyContent="center">
              <Skeleton
                variant="rectangular"
                width={200}
                height={36}
                sx={{ marginTop: "20px", borderRadius: "4px" }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      padding={{ xs: "15px", sm: "0", md: "0", lg: "0" }}
      sx={{ backgroundColor: "var(--primary-color-acc-2)" }}
    >
      {paymentLoading && retryPaymentInfo && (
        <PaymentLoadingOverlay
          setPaymentLoading={setPaymentLoading}
          {...retryPaymentInfo}
          onClose={handlePaymentClose} // Use the new callback
        />
      )}
      <Stack
        sx={{
          backgroundColor: "white",
          padding: 4,
          height: "auto",
          width: { xs: "100%", sm: "450px", md: "450px", lg: "450px" },
          borderTopRightRadius: "25px",
          borderTopLeftRadius: "25px",
        }}
      >
        <Stack display="flex" justifyContent="center" alignItems="center">
          {renderIcon()}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginTop: 1,
              fontSize: { xs: "16px", sm: "20px", md: "20px", lg: "20px" },
            }}
          >
            {headline}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              paddingTop: 2,
              fontSize: { xs: "10px", sm: "14px", md: "14px", lg: "14px" },
            }}
          >
            {message}
          </Typography>

          {(status === "completed" ||
            status === "failed" ||
            status === "created") && (
            <>
              <hr
                style={{
                  width: "100%",
                  margin: "20px 0",
                  borderColor: "var(--border-color)",
                }}
              />
              <Stack
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    color: "var(--text4)",
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                      md: "12px",
                      lg: "12px",
                    },
                  }}
                >
                  Total Payment
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: {
                      xs: "18px",
                      sm: "28px",
                      md: "28px",
                      lg: "28px",
                    },
                  }}
                >
                  INR ₹{amount}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "8px", sm: "12px", md: "12px", lg: "12px" },
                  }}
                >
                  <span style={{ fontWeight: "bold", color: "var(--text4)" }}>
                    Transaction ID:
                  </span>{" "}
                  {transactionID}
                </Typography>
              </Stack>
              <Stack
                direction={{ xs: "column", sm: "row", md: "row", lg: "row" }}
                gap={2}
                marginTop={4}
                width="100%"
                paddingX={1}
              >
                <Stack
                  sx={{
                    border: "1px solid var(--border-color)",
                    padding: "5px",
                    width: {
                      xs: "100%",
                      sm: "180px",
                      md: "180px",
                      lg: "180px",
                    },
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--text4)",
                      paddingTop: "5px",
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "12px",
                        lg: "12px",
                      },
                    }}
                  >
                    {refLabel}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "14px",
                        md: "14px",
                        lg: "14px",
                      },
                      paddingTop: "5px",
                    }}
                  >
                    {refNumber}
                  </Typography>
                </Stack>
                <Stack
                  sx={{
                    border: "1px solid var(--border-color)",
                    padding: "5px",
                    width: {
                      xs: "100%",
                      sm: "180px",
                      md: "180px",
                      lg: "180px",
                    },
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--text4)",
                      paddingTop: "5px",
                      fontSize: {
                        xs: "10px",
                        sm: "12px",
                        md: "12px",
                        lg: "12px",
                      },
                    }}
                  >
                    Payment Time
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: {
                        xs: "10px",
                        sm: "14px",
                        md: "14px",
                        lg: "14px",
                      },
                      paddingTop: "5px",
                    }}
                  >
                    {paymentTime}
                  </Typography>
                </Stack>
              </Stack>
              {status === "completed" && (
                <Stack marginTop={4} width="100%" paddingX={1}>
                  <Stack
                    sx={{
                      border: "1px solid var(--border-color)",
                      padding: "5px",
                      maxWidth: "100%",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "var(--text4)",
                        paddingTop: "5px",
                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                          md: "12px",
                          lg: "12px",
                        },
                      }}
                    >
                      Payment Method
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: {
                          xs: "10px",
                          sm: "14px",
                          md: "14px",
                          lg: "14px",
                        },
                        paddingTop: "5px",
                      }}
                    >
                      {method}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </>
          )}
        </Stack>
        <Stack
          direction={{ xs: "column", sm: "row", md: "row", lg: "row" }}
          gap={{ xs: 0, sm: 2, md: 2, lg: 2 }}
          justifyContent="center"
        >
          {(status === "failed" || status === "created") && (
            <Button
              variant="contained"
              onClick={retryPayment}
              sx={{
                marginTop: "20px",
                color: "white",
                backgroundColor: "var(--sec-color)",
                textTransform: "none",
                width: "100%",
              }}
            >
              <ReplayIcon sx={{ marginRight: "5px" }} />
              Retry Payment
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => router.push("/dashboard")}
            sx={{
              marginTop: "20px",
              color: "white",
              backgroundColor: "var(--primary-color)",
              textTransform: "none",
              width: "100%",
            }}
          >
            <MovingIcon sx={{ marginRight: "5px" }} />
            Go to Dashboard
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
