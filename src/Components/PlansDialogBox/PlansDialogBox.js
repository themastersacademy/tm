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
import { CheckBox, Close } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/src/app/context/SubscriptionProvider";

export default function PlansDialogBox({
  plansDialogOpen,
  handlePlansDialogClose,
  sx = {},
}) {
  const router = useRouter();
  const { plans } = useSubscription();
  const { data: session } = useSession();

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (plans.length > 0 && selectedPlan === null) {
      setSelectedPlan(plans[0]);
      setSelectedPlanIndex(0);
    }
  }, [plans, selectedPlan]);

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
          {/* Free Plan Card */}
          {session?.user?.accountType !== "PRO" && (
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
                {[
                  "No practise test",
                  "Limited mock tests",
                  "No free video courses",
                  "Basic Tracking",
                ].map((text, i) => (
                  <Stack
                    key={i}
                    flexDirection="row"
                    gap="10px"
                    alignItems="center"
                  >
                    <CheckBox sx={{ color: "var(--sec-color)" }} />
                    <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                      {text}
                    </Typography>
                  </Stack>
                ))}
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
          )}

          {/* Pro Plan Card */}
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
              {session?.user?.accountType !== "PRO" && (
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "28px",
                    fontWeight: "500",
                    color: "var(--white)",
                  }}
              >
                ₹{selectedPlan?.priceWithTax ?? "--"}
              </Typography>
              )}
              {session?.user?.accountType !== "PRO" && (
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--white)",
                }}
              >
                {selectedPlan?.discountInPercent ?? "--"}% off
                </Typography>
              )}  
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
              {[
                "Unlimited practise tests",
                "Advanced mock tests",
                "Free video courses",
                "Advanced tracking",
              ].map((text, i) => (
                <Stack
                  key={i}
                  flexDirection="row"
                  gap="10px"
                  alignItems="center"
                >
                  <CheckBox sx={{ color: "var(--white)" }} />
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "12px",
                      color: "var(--white)",
                    }}
                  >
                    {text}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack sx={{ marginTop: "auto" }}>
              {session?.user?.accountType === "PRO" ? (
                <Stack
                  sx={{
                    backgroundColor: "var(--primary-color-acc-2)",
                    color: "var(--primary-color)",
                    textTransform: "none",
                    borderRadius: "5px",
                    padding: "10px",
                    alignItems: "center",
                  }}
                >
                  <Typography>Current Plan</Typography>
                </Stack>
              ) : (
                <Stack sx={{ display: "flex", gap: "10px" }}>
                  <Select
                    variant="outlined"
                    value={selectedPlanIndex}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      const plan = plans[selected] ?? plans[0];
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
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "black",
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
                    }}
                    disableElevation
                  >
                    Subscribe
                  </Button>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </DialogBox>
  );
}
