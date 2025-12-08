"use client";
import {
  Stack,
  InputAdornment,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  Collapse,
} from "@mui/material";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import {
  Add,
  Update,
  Person,
  Email,
  Phone,
  Home,
  LocationCity,
  PinDrop,
  Public,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

export default function BillingInformation({
  billingInfo,
  setBillingInfo,
  handlePinChange,
  addBillingInfo,
  showBillingForm,
  setShowBillingForm,
  updateBillingInfo,
  editIndex,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBillingInfo = () => {
    addBillingInfo(billingInfo);
    setShowBillingForm(false);
  };

  const handleUpdateBillingInfo = () => {
    updateBillingInfo(billingInfo, editIndex);
    setShowBillingForm(false);
  };

  const isFormFilled = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pin",
    ];
    const isPinValid = /^\d{5,6}$/.test(billingInfo.pin);
    return (
      requiredFields.every(
        (field) => billingInfo[field] && billingInfo[field].trim() !== ""
      ) && isPinValid
    );
  };

  return (
    <Stack gap={3}>
      <Box
        sx={{
          bgcolor: "var(--white)",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 3,
            cursor: "pointer",
            userSelect: "none",
            bgcolor: showBillingForm ? "var(--library-expand)" : "var(--white)",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "var(--library-expand)",
            },
          }}
          onClick={() => setShowBillingForm(!showBillingForm)}
        >
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "var(--primary-color-acc-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-color)",
              }}
            >
              {showBillingForm ? <KeyboardArrowUp /> : <Add />}
            </Box>
            <Stack>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text1)",
                }}
              >
                {editIndex !== null
                  ? "Edit Billing Address"
                  : "Add New Billing Address"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "var(--text3)",
                }}
              >
                {showBillingForm
                  ? "Fill in the details below"
                  : "Click to add a new billing address"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Collapse in={showBillingForm}>
          <Box p={3} pt={0}>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              {/* Contact Details Section */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--primary-color)",
                    mb: 2,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Contact Details
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  name="firstName"
                  value={billingInfo.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  name="lastName"
                  value={billingInfo.lastName || ""}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <StyledTextField
                  name="email"
                  value={billingInfo.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  name="phone"
                  value={billingInfo.phone || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  placeholder="Phone Number"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Stack direction="row" alignItems="center" gap={1}>
                          <Phone sx={{ color: "var(--text4)" }} />
                          <Typography
                            sx={{
                              color: "var(--text3)",
                              fontWeight: 600,
                              fontSize: "14px",
                            }}
                          >
                            +91
                          </Typography>
                        </Stack>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>

              {/* Address Details Section */}
              <Grid item xs={12}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--primary-color)",
                    mb: 2,
                    mt: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Address Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  name="address"
                  value={billingInfo.address || ""}
                  onChange={handleInputChange}
                  placeholder="Street Address, Apartment, Suite, etc."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Home sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <StyledTextField
                  name="pin"
                  value={billingInfo.pin || ""}
                  onChange={handlePinChange}
                  placeholder="PIN Code"
                  fullWidth
                  inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PinDrop sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--white)" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name="city"
                  value={billingInfo.city || ""}
                  onChange={handleInputChange}
                  placeholder="City"
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCity sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--library-expand)" }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  name="state"
                  value={billingInfo.state || ""}
                  onChange={handleInputChange}
                  placeholder="State"
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Public sx={{ color: "var(--text4)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "var(--library-expand)" }}
                />
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                startIcon={editIndex !== null ? <Update /> : <Add />}
                sx={{
                  bgcolor: "var(--primary-color)",
                  textTransform: "none",
                  borderRadius: "100px",
                  px: 4,
                  py: 1.5,
                  fontSize: "15px",
                  fontWeight: 600,
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: "var(--primary-color-dark)",
                    transform: "translateY(-1px)",
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "var(--border-color)",
                    color: "var(--text4)",
                  },
                  transition: "all 0.2s ease",
                  width: { xs: "100%", sm: "auto" },
                }}
                onClick={
                  editIndex !== null
                    ? handleUpdateBillingInfo
                    : handleAddBillingInfo
                }
                disabled={!isFormFilled()}
              >
                {editIndex !== null ? "Update Address" : "Save Address"}
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </Stack>
  );
}
