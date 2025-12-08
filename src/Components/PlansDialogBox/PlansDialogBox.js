"use client";
import {
  Button,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Box,
  Chip,
  Radio,
} from "@mui/material";
import DialogBox from "../DialogBox/DialogBox";
import {
  CheckCircle,
  Close,
  Star,
  WorkspacePremium,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/src/app/context/SubscriptionProvider";

export default function PlansDialogBox({
  plansDialogOpen,
  handlePlansDialogClose,
}) {
  const router = useRouter();
  const { plans } = useSubscription();
  const { data: session } = useSession();

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formattedExpiryInfo, setFormattedExpiryInfo] = useState(null);

  useEffect(() => {
    if (
      session?.user?.accountType === "PRO" &&
      session?.user?.subscriptionExpiresAt
    ) {
      const expiresAt = new Date(Number(session.user.subscriptionExpiresAt));
      const now = new Date();
      const formattedDate = expiresAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      if (expiresAt < now) {
        setFormattedExpiryInfo(`Expired on ${formattedDate}`);
      } else {
        setFormattedExpiryInfo(`Expires on ${formattedDate}`);
      }
    }
  }, [session]);

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
  const isPro = session?.user?.accountType === "PRO";

  return (
    <DialogBox
      isOpen={plansDialogOpen}
      onClose={handlePlansDialogClose}
      title="Upgrade to Pro"
      sx={{ maxWidth: { xs: "100%", md: "900px" }, width: "900px" }}
      icon={
        <IconButton
          onClick={handlePlansDialogClose}
          sx={{
            borderRadius: "50%",
            bgcolor: "var(--bg-color)",
            "&:hover": { bgcolor: "var(--border-color)" },
          }}
        >
          <Close />
        </IconButton>
      }
    >
      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          gap={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {/* Free Plan Card */}
          {!isPro && (
            <Stack
              sx={{
                flex: 1,
                border: "1px solid var(--border-color)",
                borderRadius: "24px",
                p: 3,
                bgcolor: "var(--white)",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "var(--text3)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  mb: 1,
                }}
              >
                Free Plan
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--text1)",
                  mb: 2,
                }}
              >
                ₹0
                <Typography
                  component="span"
                  sx={{
                    fontSize: "14px",
                    color: "var(--text3)",
                    ml: 1,
                    fontWeight: 500,
                  }}
                >
                  / forever
                </Typography>
              </Typography>

              <Stack gap={2} mb={4}>
                {[
                  "Basic Course Access",
                  "Limited Practice Tests",
                  "Community Support",
                  "Basic Analytics",
                ].map((feature, i) => (
                  <Stack key={i} direction="row" gap={1.5} alignItems="center">
                    <CheckCircle sx={{ fontSize: 20, color: "var(--text3)" }} />
                    <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "14px",
                        color: "var(--text2)",
                      }}
                    >
                      {feature}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                disabled
                variant="outlined"
                sx={{
                  mt: "auto",
                  borderRadius: "12px",
                  textTransform: "none",
                  py: 1.5,
                  borderColor: "var(--border-color)",
                  color: "var(--text3)",
                }}
              >
                Current Plan
              </Button>
            </Stack>
          )}

          {/* Pro Plan Card */}
          <Stack
            sx={{
              flex: 1.5, // Give more space to Pro card
              border: "2px solid transparent",
              borderRadius: "24px",
              p: 3,
              background:
                "linear-gradient(var(--white), var(--white)) padding-box, linear-gradient(135deg, #FF9800 0%, #FF5722 100%) border-box",
              position: "relative",
              boxShadow: "0 10px 40px rgba(255, 152, 0, 0.15)",
              overflow: "hidden",
            }}
          >
            {/* Best Value Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "#FF9800",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: "0 0 0 16px",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <Star sx={{ fontSize: 14 }} /> BEST VALUE
            </Box>

            <Stack direction="row" gap={1} alignItems="center" mb={1}>
              <WorkspacePremium sx={{ color: "#FF9800" }} />
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#FF9800",
                  textTransform: "uppercase",
                }}
              >
                Pro Access
              </Typography>
            </Stack>

            {!isPro ? (
              <Stack direction="row" alignItems="baseline" gap={1} mb={3}>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "40px",
                    fontWeight: 900,
                    color: "var(--text1)",
                  }}
                >
                  ₹{selectedPlan?.priceWithTax ?? "--"}
                </Typography>
                {selectedPlan?.discountInPercent > 0 && (
                  <Chip
                    label={`${selectedPlan.discountInPercent}% OFF`}
                    size="small"
                    sx={{
                      bgcolor: "#FFF3E0",
                      color: "#E65100",
                      fontWeight: 700,
                      borderRadius: "6px",
                    }}
                  />
                )}
              </Stack>
            ) : (
              <Typography
                sx={{
                  fontFamily: "Lato",
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "var(--text1)",
                  mb: 3,
                }}
              >
                Active Plan
              </Typography>
            )}

            <Stack gap={2} mb={4}>
              {[
                "Unlimited Practice Tests",
                "Full-Length Mock Exams",
                "Advanced Performance Analytics",
                "Priority Support",
                "All Video Courses Included",
              ].map((feature, i) => (
                <Stack key={i} direction="row" gap={1.5} alignItems="center">
                  <CheckCircle sx={{ fontSize: 20, color: "#4CAF50" }} />
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "14px",
                      color: "var(--text1)",
                      fontWeight: 500,
                    }}
                  >
                    {feature}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            {/* Plan Duration Selector - Grid Layout */}
            {!isPro && plans.length > 0 && (
              <Box mb={3}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--text3)",
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Select Duration
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, // 2 columns on desktop
                    gap: 1.5,
                  }}
                >
                  {plans.map((plan, index) => (
                    <Box
                      key={index}
                      onClick={() => handlePlanChange(index)}
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor:
                          selectedPlanIndex === index
                            ? "var(--primary-color)"
                            : "var(--border-color)",
                        bgcolor:
                          selectedPlanIndex === index
                            ? "var(--primary-color-acc-2)"
                            : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "var(--primary-color)",
                          bgcolor:
                            selectedPlanIndex !== index && "var(--bg-color)",
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Radio
                          checked={selectedPlanIndex === index}
                          size="small"
                          sx={{
                            color: "var(--primary-color)",
                            "&.Mui-checked": { color: "var(--primary-color)" },
                            p: 0.5,
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--text1)",
                          }}
                        >
                          {plan.duration}{" "}
                          {plan.type === "MONTHLY" ? "Mo" : "Yr"}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--primary-color)",
                        }}
                      >
                        ₹{plan.priceWithTax}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Action Button */}
            {isPro ? (
              <Stack gap={1} mt="auto">
                <Button
                  disabled
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    bgcolor: "#E0E0E0 !important",
                    color: "#9E9E9E !important",
                    fontWeight: 700,
                  }}
                >
                  Plan Active
                </Button>
                {formattedExpiryInfo && (
                  <Typography
                    align="center"
                    sx={{ fontSize: "12px", color: "var(--text3)" }}
                  >
                    {formattedExpiryInfo}
                  </Typography>
                )}
              </Stack>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  router.push(
                    `/dashboard/proSubscription?plan=${subscriptionPlanID}`
                  );
                }}
                sx={{
                  mt: "auto",
                  borderRadius: "12px",
                  py: 1.5,
                  bgcolor: "var(--primary-color)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(255, 152, 0, 0.3)",
                  "&:hover": {
                    bgcolor: "#f57c00",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(255, 152, 0, 0.4)",
                  },
                }}
              >
                Subscribe Now
              </Button>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </DialogBox>
  );
}
