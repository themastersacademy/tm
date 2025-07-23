import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Edit, Logout } from "@mui/icons-material";
import { Avatar, Button, Skeleton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";

export default function BasicInfo({
  handleLogout,
  isEditMode,
  setIsEditMode,
  session,
}) {
  const [userProfileData, setUserProfileData] = useState(null);

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await fetch("/api/user/profile-data");
        const data = await response.json();
        if (data.success) {
          setUserProfileData(data.data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfileData();
  }, []);

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
        // setUserProfileData(data.data);
        enqueueSnackbar("Profile Saved", {
          variant: "success",
        });
        setIsEditMode((prev) => !prev);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  if (!userProfileData) {
    return (
      <Stack gap="20px">
        <Skeleton width="100px" />
        <Skeleton variant="circular" width="100px" height="100px" />
        <Skeleton width="200px" />
        <Skeleton width="200px" />
        <Skeleton width="200px" />
      </Stack>
    );
  }

  return (
    <Stack gap="20px">
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        sx={{ display: { xs: "none", md: "flex" } }}
      >
        <Typography
          component="div"
          sx={{
            fontFamily: "Lato",
            fontSize: "18px",
            fontWeight: "700",
            color: "var(--text3)",
          }}
        >
          Personal details
        </Typography>
        <Stack direction="row" gap="10px">
          <Button
            variant="text"
            endIcon={isEditMode ? "" : <Edit />}
            onClick={() => setIsEditMode((prev) => !prev)}
            sx={{
              textTransform: "none",
              fontFamily: "Lato",
              fontSize: "16px",
              color: "var(--primary-color)",
              padding: "2px",
            }}
          >
            {isEditMode ? "Cancel" : "Edit"}
          </Button>
          {isEditMode && (
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                width: "150px",
                textTransform: "none",
                fontFamily: "Lato",
                fontWeight: "700",
                backgroundColor: "var(--primary-color)",
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
              fontFamily: "Lato",
              fontSize: "16px",
              backgroundColor: "var(--delete-color)",
              borderRadius: "6px",
            }}
            disableElevation
          >
            Logout
          </Button>
        </Stack>
      </Stack>
      <Stack sx={{ alignItems: { xs: "center", md: "flex-start" } }}>
        {userProfileData.image ? (
          <Image
            src={userProfileData.image}
            alt="profile"
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }} />
        )}
      </Stack>
      <Stack gap="20px" width="100%">
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Name
          </Typography>
          <StyledTextField
            name="name"
            placeholder="Your Name"
            sx={{ width: { xs: "100%", md: "45%" } }}
            value={userProfileData.name || ""}
            onChange={(e) =>
              setUserProfileData({ ...userProfileData, name: e.target.value })
            }
            disabled={!isEditMode}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Email
          </Typography>
          <StyledTextField
            name="email"
            placeholder="Your Email"
            sx={{ width: { xs: "100%", md: "45%" } }}
            value={userProfileData.email || ""}
            onChange={(e) =>
              setUserProfileData({ ...userProfileData, email: e.target.value })
            }
            disabled={!isEditMode}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Phone
          </Typography>
          <StyledTextField
            name="phoneNumber"
            placeholder="Your Number"
            sx={{ width: { xs: "100%", md: "45%" } }}
            value={userProfileData.phoneNumber || ""}
            onChange={(e) =>
              setUserProfileData({
                ...userProfileData,
                phoneNumber: e.target.value,
              })
            }
            disabled={!isEditMode}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Gender
          </Typography>
          <StyledTextField
            name="gender"
            placeholder="Your Gender"
            value={userProfileData.gender || ""}
            sx={{ width: { xs: "100%", md: "45%" } }}
            onChange={(e) =>
              setUserProfileData({ ...userProfileData, gender: e.target.value })
            }
            disabled={!isEditMode}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Account type
          </Typography>
          <Stack
            sx={{
              width: "100px",
              height: "35px",
              display: "flex",
              justifyContent: "center",
              backgroundColor:
                session?.user?.accountType === "PRO"
                  ? "var(--delete-color)"
                  : "var(--primary-color)",
              color: "white",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            {session?.user?.accountType}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
