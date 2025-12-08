"use client";
import { useRouter, usePathname } from "next/navigation";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import home from "@/public/icons/home_icon.svg";
import exam from "@/public/icons/exam_icon.svg";
import courses from "@/public/icons/courses_icon.svg";
import myLearning from "@/public/icons/myLearning.svg";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const goalID = params.goalID;
  /* 
    User Request Interpretation:
    - Root `/` is the main Dashboard. Map this to "Home".
    - `/home` is the Discovery/Store page. Map this to "My Learning" (or just secondary tab).
  */
  const routeMap = [
    `/dashboard/${goalID}`, // Index 0: Home -> Root Dashboard
    `/dashboard/${goalID}/home`, // Index 1: My Learning -> /home (Discovery)
    `/dashboard/${goalID}/exam`,
    `/dashboard/${goalID}/courses`,
    `/dashboard/${goalID}/profile`,
  ];

  const getActiveTab = () => {
    // Check for specific sub-routes first
    if (pathname.startsWith(`/dashboard/${goalID}/home`)) return 1; // Now My Learning
    if (pathname.startsWith(`/dashboard/${goalID}/exam`)) return 2;
    if (pathname.startsWith(`/dashboard/${goalID}/courses`)) return 3;
    if (pathname.startsWith(`/dashboard/${goalID}/profile`)) return 4;

    // Check for Root Dashboard and My Classroom (grouped under Home now? or still My Learning?)
    // Let's assume My Classroom belongs to the "Home" flow if it's main activity,
    // OR sticking to previous logic: Dashboard root is now Home (0).
    if (
      pathname === `/dashboard/${goalID}` ||
      pathname.startsWith(`/dashboard/${goalID}/myClassroom`)
    )
      return 0;

    return 0; // Default to Home
  };

  const value = getActiveTab();

  const handleNavigationChange = (event, newValue) => {
    if (newValue !== value) {
      router.push(routeMap[newValue]);
    }
  };

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={handleNavigationChange}
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "64px",
        bgcolor: "var(--white)",
        zIndex: 100,
        borderTop: "1px solid var(--border-color)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      {[
        { label: "Home", icon: home, index: 0 },
        { label: "My Learning", icon: myLearning, index: 1 },
        { label: "Exam", icon: exam, index: 2 },
        { label: "Courses", icon: courses, index: 3 },
        { label: "Profile", icon: home, index: 4 },
      ].map(({ label, icon, index }) => (
        <BottomNavigationAction
          key={index}
          label={label}
          icon={
            <Image
              src={icon}
              alt={label}
              width={20}
              height={20}
              style={{
                opacity: value === index ? 1 : 0.5,
                filter:
                  value === index
                    ? "brightness(0) saturate(100%) invert(34%) sepia(16%) saturate(1939%) hue-rotate(128deg) brightness(98%) contrast(92%)"
                    : "grayscale(100%)",
                transition: "all 0.3s ease",
              }}
            />
          }
          sx={{
            minWidth: "fit-content",
            padding: "6px 0",
            "& .MuiBottomNavigationAction-label": {
              fontSize: value === index ? "11px" : "10px",
              fontWeight: value === index ? 700 : 500,
              color: value === index ? "var(--primary-color)" : "var(--text4)",
              marginTop: "4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "all 0.3s ease",
            },
          }}
        />
      ))}
    </BottomNavigation>
  );
}
