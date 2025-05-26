"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import Header from "@/src/Components/Header/Header";
import CrackTest from "./Components/CrackTest";
import InfoCard from "./Components/InfoCard";
import gate_cse from "@/public/icons/gate_cse.svg";
import banking from "@/public/icons/banking.svg";
import placements from "@/public/icons/placements.svg";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import Store from "../courses/Components/Store";
import { East } from "@mui/icons-material";
import BannerCarousel from "@/src/Components/BannerCarousel/BannerCarousel";
import HomeBannerSkeleton from "@/src/Components/SkeletonCards/HomeBannerSkeleton";
import { useRouter, useParams } from "next/navigation";
import PageSkeleton from "@/src/Components/SkeletonCards/PageSkeleton";
import NoDataFound from "@/src/Components/NoDataFound/NoDataFound";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import PrimaryCardSkeleton from "@/src/Components/SkeletonCards/PrimaryCardSkeleton";
import HeaderSkeleton from "@/src/Components/SkeletonCards/HeaderSkeleton";
import FAQSect from "./Components/FAQSect";
import HowDoes from "./Components/HowDoes";
import enroll from "@/public/images/enrollCourse.svg";
import graduate from "@/public/images/graduate.svg";
import achieve from "@/public/images/achieve.svg";
import InsightCard from "./Components/InsightCard";
import { useBanners } from "@/src/app/context/BannerProvider";
import { useGoals } from "@/src/app/context/GoalProvider";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { banners, loading, refetchBanners } = useBanners();
  const { goals, loading: goalLoading, refetchGoals } = useGoals();
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;
  const { data: session } = useSession();

  return (
    <>
      <MobileHeader />
      <Stack
        alignItems="center"
        width="100%"
        maxWidth="1200px"
        margin="0 auto"
        sx={{ marginBottom: { xs: "80px", md: "0px" } }}
      >
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
                    {goalLoading ? (
                      <Stack direction="row" gap="10px">
                        <PrimaryCardSkeleton />
                        <PrimaryCardSkeleton />
                      </Stack>
                    ) : goals.length > 0 ? (
                      goals.map((item, index) => (
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
                <Stack
                  flexDirection="row"
                  flexWrap="wrap"
                  gap="20px"
                  alignItems="center"
                  justifyContent={{ xs: "center", md: "flex-start" }}
                >
                  <HowDoes
                    image={enroll}
                    title="01. Enroll Course"
                    description="Sign up and browse our courses. Choose those that align with your goals and interests, and enroll to start your learning journey."
                  />
                  <HowDoes
                    image={graduate}
                    title="02. Graduate"
                    description="Get guidance from expert tutors, graduate successfully, and receive a certification to validate your new skills."
                  />
                  <HowDoes
                    image={achieve}
                    title="03. Achieve"
                    description="Leverage your new skills and certification to advance your career and reach your goals. Stay connected for ongoing support."
                  />
                </Stack>
                <InsightCard />
              </Stack>
              {session?.user?.accountType !== "PRO" && <CrackTest />}
              {/* <CrackTest /> */}
              <FAQSect />
            </>
          )}
        </Stack>
      </Stack>
    </>
  );
}
