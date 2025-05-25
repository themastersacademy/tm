import { Stack, Button, Typography, Skeleton } from "@mui/material";
import { useSession } from "next-auth/react";

export default function ProFloatingButton({ isDisabled, onClick }) {
  const { data: session } = useSession();
  return (
    <Stack
      sx={{
        backgroundColor: "var(--white)",
        padding: "20px",
      }}
    >
      <Stack>
        <Stack flexDirection="row" gap="10px" justifyContent="space-between">
          <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
            Total:
          </Typography>
          {/* {priceBreakdown?.totalPrice ? (
            <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
              Pay: ₹{priceBreakdown.totalPrice.toFixed(2)}
            </Typography>
          ) : (
            <Skeleton variant="text" width={100} />
          )} */}
        </Stack>
        <Stack>
          <Typography sx={{ fontSize: "12px" }}>
            By completing your purchases, you agreed to this{" "}
            <span style={{ color: "var(--primary-color)" }}>Terms of use</span>.
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          disabled={isDisabled || session?.user?.accountType === "PRO"}
          onClick={onClick}
          sx={{
            backgroundColor: isDisabled
              ? "var(--sec-color)"
              : "var(--sec-color)",
            color: "var(--white)",
            fontSize: "16px",
            fontFamily: "Lato",
            fontWeight: "700",
            padding: "10px 20px",
            borderRadius: "10px",
            textTransform: "none",
            width: { xs: "240px", sm: "300px" },
            "&:hover": {
              backgroundColor: isDisabled
                ? "var(--sec-color)"
                : "var(--sec-color)",
            },
          }}
        >
          Proceed to Payment
        </Button>
      </Stack>
    </Stack>
  );
}
