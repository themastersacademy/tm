"use client";
import {
  Button,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import DialogBox from "../DialogBox/DialogBox";
import { CheckBox, Close } from "@mui/icons-material"
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PlansDialogBox({
  plansDialogOpen,
  handlePlansDialogClose,
}) {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPlans = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/get-all-plans`
      );
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
        setSelectedPlan(data.data[0]);
        setSelectedPlanIndex(0);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch plans:", data.message);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanChange = (index) => {
    setSelectedPlan(plans[index]);
    setSelectedPlanIndex(index);
  };

  const subscriptionPlanID = plans[selectedPlanIndex]?.id;

  return (
    <DialogBox
      isOpen={plansDialogOpen}
      onClose={handlePlansDialogClose}
      title="Plans"
      icon={
        <IconButton
          onClick={handlePlansDialogClose}
          sx={{ borderRadius: "8px", padding: "4px" }}
        >
          <Close />
        </IconButton>
      }
    >
      <DialogContent>
        <Stack
          flexDirection={{ xs: "column", md: "row" }}
          gap="20px"
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Stack
            sx={{
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "20px",
              width: "250px",
              height: "380px",
            }}
          >
            <Stack sx={{ marginBottom: "20px" }}>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "500",
                }}
              >
                Free
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "28px",
                  fontWeight: "500",
                }}
              >
                ₹0
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                per user
              </Typography>
            </Stack>
            <Stack gap="10px">
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                For Students
              </Typography>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--sec-color)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  No practise test
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--sec-color)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  Limited mock tests
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--sec-color)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  No free video courses
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--sec-color)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                  }}
                >
                  Basic Tracking
                </Typography>
              </Stack>
            </Stack>
            <Stack
              sx={{
                backgroundColor: "var(--sec-color-acc-1)",
                color: "var(--sec-color)",
                textTransform: "none",
                marginTop: "35px",
                borderRadius: "5px",
                padding: "10px",
                alignItems: "center",
              }}
            >
              <Typography>Current Plan</Typography>
            </Stack>
          </Stack>
          <Stack
            sx={{
              backgroundColor: "var(--primary-color)",
              borderRadius: "10px",
              padding: "20px",
              width: "250px",
              height: "380px",
            }}
          >
            <Stack sx={{ marginBottom: "10px" }}>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "var(--white)",
                }}
              >
                Pro
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "28px",
                  fontWeight: "500",
                  color: "var(--white)",
                }}
              >
                ₹{selectedPlan?.priceWithTax}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--white)",
                }}
              >
                {selectedPlan?.discountInPercent}% off
              </Typography>
            </Stack>
            <Stack gap="4px">
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "var(--white)",
                }}
              >
                For Students & Aspirants
              </Typography>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--white)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    color: "var(--white)",
                  }}
                >
                  Unlimited practise tests
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--white)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    color: "var(--white)",
                  }}
                >
                  Advanced mock tests
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--white)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    color: "var(--white)",
                  }}
                >
                  Free video courses
                </Typography>
              </Stack>
              <Stack flexDirection="row" gap="10px" alignItems="center">
                <CheckBox sx={{ color: "var(--white)" }} />
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "12px",
                    color: "var(--white)",
                  }}
                >
                  Advanced tracking
                </Typography>
              </Stack>
            </Stack>

            {session?.user?.accountType !== "PRO" && (
              <Stack
                sx={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "auto",
                }}
              >
                <Stack sx={{ marginTop: "auto" }}>
                  <Select
                    variant="outlined"
                    value={selectedPlan?.duration || ""}
                    onChange={(e) => {
                      handlePlanChange(e.target.value);
                    }}
                    displayEmpty
                    renderValue={(selected) => {
                      const plan = selected
                        ? plans.find((p) => p.duration === selected)
                        : plans[0];
                      return `${plan.duration} ${
                        plan.type === "MONTHLY" ? "month" : "year"
                      }`;
                    }}
                    MenuProps={{
                      disableScrollLock: true,
                      PaperProps: {
                        sx: {
                          padding: "8px",
                          "& .MuiList-root": {
                            paddingBottom: 0,
                            borderColor: "white",
                          },
                        },
                      },
                    }}
                    sx={{
                      minWidth: "100%",
                      height: "35px",
                      color: "black",
                      backgroundColor: "white",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
                      },
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "black",
                        },
                      },
                    }}
                  >
                    {plans.map((plan, index) => (
                      <MenuItem key={index} value={index}>
                        {`${plan.duration} ${
                          plan.type === "MONTHLY" ? "month" : "year"
                        }`}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push(
                      `/dashboard/proSubscription?plan=${subscriptionPlanID}`
                    );
                  }}
                  sx={{
                    backgroundColor: "var(--primary-color-acc-2)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    marginTop: "auto",
                  }}
                  disableElevation
                >
                  Subscribe
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </DialogBox>
  );
}
