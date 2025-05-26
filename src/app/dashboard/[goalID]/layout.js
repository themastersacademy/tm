import MobileBottomNav from "@/src/Components/BottomNavigation/BottomNavigation";
import SideNav from "@/src/Components/SideNav/SideNav";
import { Stack } from "@mui/material";
import { CourseProvider } from "@/src/app/context/CourseProvider";
import { SubscriptionProvider } from "@/src/app/context/SubscriptionProvider";
import { ExamProvider } from "@/src/app/context/ExamProvider";
import { BannerProvider } from "@/src/app/context/BannerProvider";
import { ClassroomProvider } from "@/src/app/context/ClassroomProvider";

export default function Layout({ children }) {
  return (
    <BannerProvider>
      <SubscriptionProvider>
        <ExamProvider>
          <Stack
            flexDirection="row"
            bgcolor="var(--sec-color-acc-2)"
            minHeight="100vh"
          >
            <SideNav />
            <MobileBottomNav />
            <ClassroomProvider>
              <CourseProvider>
                <Stack width="100%">{children}</Stack>
              </CourseProvider>
            </ClassroomProvider>
          </Stack>
        </ExamProvider>
      </SubscriptionProvider>
    </BannerProvider>
  );
}
