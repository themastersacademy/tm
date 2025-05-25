import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Edit, Logout } from "@mui/icons-material";
import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";

export default function BasicInfo({ session, handleLogout }) {
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
            endIcon={<Edit />}
            sx={{
              textTransform: "none",
              fontFamily: "Lato",
              fontSize: "16px",
              color: "var(--primary-color)",
              padding: "2px",
            }}
          >
            Edit
          </Button>
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
        <Avatar sx={{ width: "100px", height: "100px" }} />
      </Stack>
      {/* <Stack sx={{ display: { xs: "none", md: "block" } }}>
        <Divider />
      </Stack> */}
      <Stack gap="20px" width="100%">
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Name
          </Typography>
          <StyledTextField
            placeholder="Your Name"
            sx={{ width: { xs: "100%", md: "45%" } }}
            value={session?.user?.name || ""}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Email
          </Typography>
          <StyledTextField
            placeholder="Your Email"
            sx={{ width: { xs: "100%", md: "45%" } }}
            value={session?.user?.email || ""}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Phone
          </Typography>
          <StyledTextField
            placeholder="Your Number"
            value={session?.user?.phoneNumber || ""}
            sx={{ width: { xs: "100%", md: "45%" } }}
          />
        </Stack>
        <Stack gap="10px" flexDirection="row" alignItems="center">
          <Typography component="div" sx={{ width: "100px" }}>
            Address
          </Typography>
          <StyledTextField
            placeholder="Your Address"
            value={session?.user?.address || ""}
            sx={{ width: { xs: "100%", md: "45%" } }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
