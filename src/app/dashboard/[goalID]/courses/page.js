"use client";
import CustomTabs from "@/src/Components/CustomTabs/CustomTabs";
import Header from "@/src/Components/Header/Header";
import { Stack, Typography } from "@mui/material";
import Store from "./Components/Store";
import MyCourses from "./Components/MyCourses";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import { useParams } from "next/navigation";

export default function Courses() {
  const params = useParams();
  const { goalID } = params;
  console.log("goalID", goalID);
  const tabData = [
    { label: "Store", content: <Store /> },
    {
      label: "My Courses",
      content: <MyCourses />,
    },
  ];

  return (
    <Stack width="100%" alignItems="center">
      <MobileHeader />
      <Stack
        width="100%"
        maxWidth="1200px"
        alignItems={{ xs: "flex-start", md: "center" }}
        padding={{ xs: "5px", md: "20px" }}
        pb="30px"
        gap="20px"
      >
        {/* Desktop Header and Tabs */}
        <Stack sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
          <Header />
        </Stack>
        <Stack sx={{ display: { xs: "none", md: "flex" }, width: "100%" }}>
          <CustomTabs tabs={tabData} />
        </Stack>

        {/* Mobile View */}
        <Stack
          sx={{
            display: { xs: "flex", md: "none" },
            gap: "20px",
            width: "100%",
            px: "10px",
            mb: "60px",
          }}
        >
          {/* <SearchBox key="search" /> */}
          <Stack gap="10px">
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "700" }}
            >
              My Courses
            </Typography>
            <MyCourses />
          </Stack>
          <Stack gap="10px">
            <Typography
              sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "700" }}
            >
              Browse Courses
            </Typography>
            <Store />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
