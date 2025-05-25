"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Header from "@/src/Components/Header/Header";
import FreeTest from "./Components/FreeTest";
import PracticeTest from "./Components/PracticeTest";
import CrackTest from "./Components/CrackTest";
import InfoCard from "./Components/InfoCard";
import gate_cse from "@/public/icons/gate_cse.svg";
import banking from "@/public/icons/banking.svg";
import placements from "@/public/icons/placements.svg";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import Store from "../courses/Components/Store";
import { East } from "@mui/icons-material";
import BannerCarousel from "@/src/Components/BannerCarousel/BannerCarousel";
import { useState, useEffect } from "react";
import HomeBannerSkeleton from "@/src/Components/SkeletonCards/HomeBannerSkeleton";
import { useRouter, useParams } from "next/navigation";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import HeaderSkeleton from "@/src/Components/SkeletonCards/HeaderSkeleton";
import { useSession } from "next-auth/react";
import FAQSect from "./Components/FAQSect";
import HowDoes from "./Components/HowDoes";

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalDetails, setGoalDetails] = useState([]);
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchBanners() {
      const cachedData = localStorage.getItem("homeBannersData");
      if (cachedData) {
        const { banners, timestamp } = JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < 25 * 60 * 1000;
        if (isCacheValid) {
          setBanners(banners);
          setLoading(false);
          return;
        }
      }
      try {
        const response = await fetch("/api/home/banner", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          throw new Error(`Invalid JSON: ${text.substring(0, 50)}...`);
        }
        if (!response.ok) {
          throw new Error(data.error || `HTTP error: ${response.status}`);
        }
        const sortedBanners = Array.isArray(data.data)
          ? data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          : [];
        const bannerUrls = sortedBanners.map((banner) => banner.image);
        setBanners(bannerUrls);
        localStorage.setItem(
          "homeBannersData",
          JSON.stringify({ banners: bannerUrls, timestamp: Date.now() })
        );
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchBanners();
  }, []);

  const fetchGoal = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/goal/all`
    );
    const data = await response.json();
    setGoalDetails(data.data);
    setLoading(false);
  };
  useEffect(() => {
    fetchGoal();
  }, []);

  return (
    <>
      <MobileHeader />
      <Stack alignItems="center" width="100%" maxWidth="1200px" margin="0 auto">
        <Stack padding={{ xs: "10px", md: "20px" }} gap="20px" width="100%">
          <Stack
            width="100%"
            maxWidth="1200px"
            sx={{ display: { xs: "none", md: "block" } }}
          >
            {loading ? <HeaderSkeleton /> : <Header />}
          </Stack>
          {loading ? (
            <PageSkeleton />
          ) : (
            <>
              <Stack width="100%" maxWidth="1200px">
                {loading ? (
                  <HomeBannerSkeleton key="skeleton" />
                ) : error ? (
                  <Stack direction="row" gap="10px" alignItems="center">
                    <Typography color="error">Error: {error}</Typography>
                  </Stack>
                ) : (
                  <BannerCarousel banners={banners} />
                )}
              </Stack>
              <InfoCard />
              <Stack gap="20px" width="100%" maxWidth="1200px">
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Goals
                </Typography>
                <Box
                  sx={{
                    overflowX: { xs: "auto", md: "" },
                    whiteSpace: "nowrap",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    width: "100%",
                  }}
                >
                  <Stack
                    flexDirection="row"
                    flexWrap={{ xs: "wrap" }}
                    gap="10px"
                    sx={{
                      minWidth: { xs: "max-content", md: "100%" },
                    }}
                  >
                    {loading ? (
                      <Stack direction="row" gap="10px">
                        <PrimaryCardSkeleton />
                        <PrimaryCardSkeleton />
                      </Stack>
                    ) : goalDetails.length > 0 ? (
                      goalDetails.map((item, index) => (
                        <PrimaryCard
                          key={index}
                          title={item.title}
                          actionButton={
                            <Button
                              variant="text"
                              endIcon={<East />}
                              onClick={() =>
                                router.push(
                                  `/dashboard/${goalID}/home/${item.id}`
                                )
                              }
                              sx={{
                                textTransform: "none",
                                fontFamily: "Lato",
                                color: "var(--primary-color)",
                                fontSize: "14px",
                                padding: "2px",
                              }}
                            >
                              Enrolled
                            </Button>
                          }
                          icon={
                            item.icon === "castle"
                              ? gate_cse
                              : item.icon === "org"
                              ? banking
                              : placements
                          }
                          enrolled={item.enrolled}
                        />
                      ))
                    ) : (
                      <NoDataFound info="No Goals are enrolled" />
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Stack
                sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}
              >
                <Stack
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ marginBottom: "15px" }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Lato",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    Store
                  </Typography>
                  <Button
                    variant="text"
                    endIcon={<East />}
                    onClick={() => {
                      router.push(`/dashboard/${goalID}/courses`);
                    }}
                    sx={{
                      textTransform: "none",
                      color: "var(--primary-color)",
                      fontSize: "12px",
                    }}
                  >
                    View Store
                  </Button>
                </Stack>
                <Store />
              </Stack>
              <Stack gap="20px" width="100%" maxWidth="1200px">
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  How does this work
                </Typography>
                <HowDoes />
              </Stack>
              <Stack gap="20px" width="100%" maxWidth="1200px">
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Free Tests
                </Typography>
                <FreeTest />
              </Stack>

              {/* <Stack gap="20px" width="100%" maxWidth="1200px">
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Practice Test
                </Typography>
                <PracticeTest />
              </Stack> */}
              <CrackTest />
              <FAQSect />
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
