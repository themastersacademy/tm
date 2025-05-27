"use client";
import CustomTabs from "@/src/Components/CustomTabs/CustomTabs";
import Header from "@/src/Components/Header/Header";
import { Stack } from "@mui/material";
import Store from "./Components/Store";
import MyCourses from "./Components/MyCourses";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import { useParams } from "next/navigation";

export default function Courses() {
  const params = useParams();
  const { goalID } = params;
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
        sx={{ mt: { xs: "10px", md: "0px" } }}
      >
        <Stack sx={{ display: { xs: "none", md: "block" }, width: "100%" }}>
          <Header />
        </Stack>
        <Stack
        paddingX={{ xs: "0px", sm: "20px", md: "0px" }}
         sx={{ width: "100%" }}>
          <CustomTabs
           tabs={tabData} />
        </Stack>
      </Stack>
    </Stack>
  );
}
