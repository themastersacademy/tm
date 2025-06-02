"use client";
import {
  Stack,
  InputAdornment,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Add, Update } from "@mui/icons-material";

export default function ProBillingInformation({
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
    <Stack>
      <Stack
        sx={{
          backgroundColor: "var(--white)",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Stack>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="var(--white)"
            padding="10px"
            borderRadius="8px"
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={showBillingForm}
                  onChange={(e) => setShowBillingForm(e.target.checked)}
                  sx={{
                    color: "var(--sec-color)",
                    "&.Mui-checked": {
                      color: "var(--sec-color)",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{ fontSize: { xs: "10px", sm: "14px", md: "16px" } }}
                >
                  {editIndex !== null
                    ? "Edit Billing Address"
                    : "Add Billing Address"}
                </Typography>
              }
            />

            {/* Desktop button (hidden on mobile) */}
            {showBillingForm && (
              <Button
                variant="contained"
                startIcon={editIndex !== null ? <Update /> : <Add />}
                sx={{
                  display: { xs: "none", md: "flex" },
                  backgroundColor: "var(--sec-color)",
                  textTransform: "none",
                  borderRadius: "8px",
                  height: "40px",
                  opacity: isFormFilled() ? 1 : 0.6,
                  fontSize: { sm: "14px", md: "16px" },
                }}
                onClick={
                  editIndex !== null
                    ? handleUpdateBillingInfo
                    : handleAddBillingInfo
                }
                disabled={!isFormFilled()}
              >
                {editIndex !== null ? "Update" : "Save"}
              </Button>
            )}
          </Stack>
        </Stack>

        {showBillingForm && (
          <>
            <Stack
              flexDirection={{ md: "column", lg: "row" }}
              gap="30px"
              width="100%"
              marginTop="25px"
            >
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>First Name</label>
                <StyledTextField
                  name="firstName"
                  value={billingInfo.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="eg. John"
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                    "& .MuiInputBase-input::placeholder": {
                      color: "var(--text4)",
                      opacity: 1,
                    },
                  }}
                />
              </Stack>
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>Last Name</label>
                <StyledTextField
                  value={billingInfo.lastName || ""}
                  onChange={handleInputChange}
                  name="lastName"
                  placeholder="eg. Doe"
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                  }}
                />
              </Stack>
            </Stack>

            <Stack
              flexDirection={{ md: "column", lg: "row" }}
              gap="30px"
              marginTop="25px"
              width="100%"
            >
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>Email Address</label>
                <StyledTextField
                  value={billingInfo.email || ""}
                  onChange={handleInputChange}
                  name="email"
                  placeholder="youremail@example.com"
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                  }}
                />
              </Stack>
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>Phone Number</label>
                <StyledTextField
                  value={billingInfo.phone || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  name="phone"
                  placeholder="eg. 9999988888"
                  inputProps={{ maxLength: 10 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">+91</InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                  }}
                />
              </Stack>
            </Stack>

            <Stack marginTop="25px" width="100%">
              <label style={{ color: "var(--text3)" }}>Address</label>
              <StyledTextField
                value={billingInfo.address || ""}
                onChange={handleInputChange}
                name="address"
                placeholder="eg. 123 Main St, Kovilpatti, Tamil Nadu"
                sx={{
                  width: "100%",
                  marginTop: "10px",
                  backgroundColor: "var(--white)",
                }}
              />
            </Stack>

            <Stack marginTop="25px" width="100%">
              <label style={{ color: "var(--text3)" }}>PIN Code</label>
              <StyledTextField
                name="pin"
                value={billingInfo.pin || ""}
                onChange={handlePinChange}
                placeholder="eg. 628501"
                inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                sx={{
                  width: "100%",
                  marginTop: "10px",
                  backgroundColor: "var(--white)",
                }}
              />
            </Stack>

            <Stack
              flexDirection={{ md: "column", lg: "row" }}
              gap="30px"
              width="100%"
              marginTop="25px"
            >
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>City</label>
                <StyledTextField
                  name="city"
                  value={billingInfo.city || ""}
                  onChange={handleInputChange}
                  placeholder="eg. Kovilpatti"
                  disabled
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                  }}
                />
              </Stack>
              <Stack width="100%">
                <label style={{ color: "var(--text3)" }}>State</label>
                <StyledTextField
                  name="state"
                  value={billingInfo.state || ""}
                  onChange={handleInputChange}
                  placeholder="eg. Tamil Nadu"
                  disabled
                  sx={{
                    width: "100%",
                    marginTop: "10px",
                    backgroundColor: "var(--white)",
                  }}
                />
              </Stack>
            </Stack>

            {/* Mobile button below the form */}
            <Stack
              display={{ xs: "flex", md: "none" }}
              marginTop="30px"
              alignItems="left"
            >
              <Button
                variant="contained"
                startIcon={editIndex !== null ? <Update /> : <Add />}
                sx={{
                  width: "110px",
                  maxWidth: "300px",
                  backgroundColor: "var(--sec-color)",
                  textTransform: "none",
                  borderRadius: "8px",
                  height: "45px",
                  opacity: isFormFilled() ? 1 : 0.6,
                  fontSize: "14px",
                }}
                onClick={
                  editIndex !== null
                    ? handleUpdateBillingInfo
                    : handleAddBillingInfo
                }
                disabled={!isFormFilled()}
              >
                {editIndex !== null ? "Update" : "Save"}
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
}
