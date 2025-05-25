import MobileBottomNav from "@/src/Components/BottomNavigation/BottomNavigation";
import SideNav from "@/src/Components/SideNav/SideNav";
import { Stack } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Stack
      flexDirection="row"
      bgcolor="var(--sec-color-acc-2)"
      minHeight="100vh"
    >
      <SideNav />
      <MobileBottomNav />
      <Stack width="100%">{children}</Stack>
    </Stack>
  );
}
