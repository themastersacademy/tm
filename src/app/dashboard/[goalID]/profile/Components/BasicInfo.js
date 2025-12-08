import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import { Edit, Person, Email, Phone, Wc, Logout } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Skeleton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";

export default function BasicInfo({
  handleLogout,
  isEditMode,
  setIsEditMode,
  session,
  userProfileData,
  setUserProfileData,
}) {
  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/update-profile-data", {
        method: "POST",
        body: JSON.stringify({
          name: userProfileData.name,
          email: userProfileData.email,
          phoneNumber: userProfileData.phoneNumber,
          gender: userProfileData.gender,
        }),
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Profile Saved Successfully", {
          variant: "success",
        });
        setIsEditMode(false);
      } else {
        enqueueSnackbar(data.message || "Failed to save profile", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      enqueueSnackbar("Error updating profile", {
        variant: "error",
      });
    }
  };

  if (!userProfileData) {
    return (
      <Stack gap="20px" padding="20px">
        <Skeleton width="100%" height="60px" />
        <Skeleton width="100%" height="60px" />
        <Skeleton width="100%" height="60px" />
        <Skeleton width="100%" height="60px" />
      </Stack>
    );
  }

  const formFields = [
    {
      label: "Full Name",
      icon: Person,
      name: "name",
      value: userProfileData.name || "",
      placeholder: "Enter your full name",
    },
    {
      label: "Email Address",
      icon: Email,
      name: "email",
      value: userProfileData.email || "",
      placeholder: "Enter your email",
    },
    {
      label: "Phone Number",
      icon: Phone,
      name: "phoneNumber",
      value: userProfileData.phoneNumber || "",
      placeholder: "Enter your phone number",
    },
    {
      label: "Gender",
      icon: Wc,
      name: "gender",
      value: userProfileData.gender || "",
      placeholder: "Enter your gender",
    },
  ];

  return (
    <Stack gap="24px">
      {/* Header with Edit/Save */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--text1)",
          }}
        >
          Personal Information
        </Typography>
        <Stack direction="row" gap="12px">
          <Button
            variant={isEditMode ? "outlined" : "text"}
            startIcon={isEditMode ? null : <Edit />}
            onClick={() => setIsEditMode((prev) => !prev)}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              color: "var(--primary-color)",
              borderColor: "var(--primary-color)",
              "&:hover": {
                borderColor: "var(--primary-color-dark)",
                backgroundColor: "var(--sec-color-acc-2)",
              },
            }}
          >
            {isEditMode ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditMode && (
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                textTransform: "none",
                fontSize: "14px",
                backgroundColor: "var(--primary-color)",
                "&:hover": {
                  backgroundColor: "var(--primary-color-dark)",
                },
              }}
            >
              Save Changes
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              backgroundColor: "var(--delete-color)",
              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Stack>

      {/* Form Fields */}
      <Stack gap="20px">
        {formFields.map((field) => {
          const IconComponent = field.icon;

          if (field.name === "gender") {
            return (
              <Stack key={field.name} gap="8px">
                <Stack direction="row" alignItems="center" gap="8px">
                  <IconComponent sx={{ fontSize: 18, color: "var(--text3)" }} />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text2)",
                    }}
                  >
                    {field.label}
                  </Typography>
                </Stack>
                {isEditMode ? (
                  <StyledSelect
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    value={field.value}
                    onChange={(e) =>
                      setUserProfileData({
                        ...userProfileData,
                        [field.name]: e.target.value,
                      })
                    }
                    getLabel={(option) => option.label}
                    getValue={(option) => option.value}
                    placeholder="Select Gender"
                  />
                ) : (
                  <StyledTextField
                    name={field.name}
                    placeholder={field.placeholder}
                    value={field.value}
                    disabled={true}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "var(--bg1)",
                      },
                    }}
                  />
                )}
              </Stack>
            );
          }

          return (
            <Stack key={field.name} gap="8px">
              <Stack direction="row" alignItems="center" gap="8px">
                <IconComponent sx={{ fontSize: 18, color: "var(--text3)" }} />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text2)",
                  }}
                >
                  {field.label}
                </Typography>
              </Stack>
              <StyledTextField
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) =>
                  setUserProfileData({
                    ...userProfileData,
                    [field.name]: e.target.value,
                  })
                }
                disabled={!isEditMode}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditMode ? "white" : "var(--bg1)",
                  },
                }}
              />
            </Stack>
          );
        })}

        {/* Account Type Display */}
        <Stack gap="8px">
          <Stack direction="row" alignItems="center" gap="8px">
            <Person sx={{ fontSize: 18, color: "var(--text3)" }} />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text2)",
              }}
            >
              Account Type
            </Typography>
          </Stack>
          <Box
            sx={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 24px",
              backgroundColor:
                session?.user?.accountType === "PRO"
                  ? "#FFD700"
                  : "var(--primary-color)",
              color: session?.user?.accountType === "PRO" ? "#000" : "white",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {session?.user?.accountType || "FREE"}
          </Box>
        </Stack>
      </Stack>

      {/* Mobile Edit Section */}
      <Stack gap="12px" sx={{ display: { xs: "flex", md: "none" } }}>
        <Button
          variant={isEditMode ? "outlined" : "contained"}
          fullWidth
          startIcon={isEditMode ? null : <Edit />}
          onClick={() => setIsEditMode((prev) => !prev)}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            backgroundColor: isEditMode
              ? "transparent"
              : "var(--primary-color)",
            color: isEditMode ? "var(--primary-color)" : "white",
            borderColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: isEditMode
                ? "var(--sec-color-acc-2)"
                : "var(--primary-color-dark)",
            },
          }}
        >
          {isEditMode ? "Cancel Editing" : "Edit Profile"}
        </Button>
        {isEditMode && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
            sx={{
              textTransform: "none",
              fontSize: "14px",
              backgroundColor: "var(--primary-color)",
              "&:hover": {
                backgroundColor: "var(--primary-color-dark)",
              },
            }}
          >
            Save Changes
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
