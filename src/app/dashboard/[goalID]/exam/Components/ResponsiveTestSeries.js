"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { East, ExpandMore } from "@mui/icons-material";
import { useEffect, useState } from "react";
import MobileHeader from "@/src/Components/MobileHeader/MobileHeader";
import mocks from "@/public/icons/mocks.svg";
import troffy from "@/public/icons/troffy.svg";
import Image from "next/image";
import TestSeries from "./TestSeries";
import MyClassroom from "../../myClassroom/page";
import ExamHistoryResponsive from "@/src/Components/ExamHistoryResponsive/ExamHistoryResponsive";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { useRouter } from "next/navigation";

export default function ResponsiveTestSeries({
  testSeries,
  groupExams,
  subjectOptions,
}) {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const router = useRouter();
  const [groupExam, setGroupExam] = useState({});

  const fetchGroupExam = async (groupID) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/type/${groupID}/group/all-exams`
      );
      const data = await response.json();
      if (data.success) {
        setGroupExam((prev) => ({
          ...prev,
          [groupID]: data.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching group exams:", err);
    }
  };

  useEffect(() => {
    groupExams.forEach((item) => {
      fetchGroupExam(item.id);
    });
  }, [groupExams]);

  return (
    <Stack sx={{ display: { xs: "block", md: "none" } }}>
      <Stack>
        <Stack sx={{ marginBottom: "15px" }}>
          <MobileHeader />
        </Stack>
        <Stack sx={{ padding: "10px", gap: "10px" }}>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            sx={{
              boxShadow: "none",
              border: "none",
              "&::before": { display: "none" },
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Stack
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "var(--sec-color-acc-1)",
                  borderRadius: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "15px",
                }}
              >
                <Image src={mocks} alt="" width={22} height={22} />
              </Stack>
              <Stack>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Masters test series
                </Typography>
                <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                  Tap to see more
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  overflowX: "auto",
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
                  {testSeries.length > 0 ? (
                    testSeries.map((item, index) => (
                      <PrimaryCard
                        key={index}
                        title={item.title}
                        actionButton={
                          <Button
                            variant="text"
                            endIcon={<East />}
                            onClick={() => router.push(`/exam/${item.id}`)}
                            sx={{
                              color: "var(--primary-color)",
                              textTransform: "none",
                              fontSize: "12px",
                            }}
                          >
                            Take Test
                          </Button>
                        }
                        icon={mocks.src}
                      />
                    ))
                  ) : (
                    <Typography>No test series found</Typography>
                  )}
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            sx={{
              boxShadow: "none",
              border: "none",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Stack
                sx={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "var(--sec-color-acc-1)",
                  borderRadius: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "15px",
                }}
              >
                <Image src={mocks} alt="" width={22} height={22} />
              </Stack>
              <Stack>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  Practice test
                </Typography>
                <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                  Tap to see more
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <TestSeries subjectOptions={subjectOptions} />
            </AccordionDetails>
          </Accordion>
          {groupExams.length > 0 &&
            groupExams.map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === item.id}
                onChange={handleChange(item.id)}
                sx={{
                  boxShadow: "none",
                  border: "none",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Stack
                    sx={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "var(--sec-color-acc-1)",
                      borderRadius: "10px",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "15px",
                    }}
                  >
                    <Image src={mocks} alt="" width={22} height={22} />
                  </Stack>
                  <Stack>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "Lato",
                        fontSize: "16px",
                        fontWeight: "700",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
                      Tap to see more
                    </Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      overflowX: "auto",
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
                      {(groupExam[item.id] || []).length > 0 ? (
                        groupExam[item.id].map((exam) => (
                          <PrimaryCard
                            key={exam.id}
                            title={exam.title}
                            icon={troffy.src}
                            actionButton={
                              <Button
                                variant="text"
                                endIcon={<East />}
                                onClick={() => router.push(`/exam/${exam.id}`)}
                                sx={{
                                  color: "var(--primary-color)",
                                  textTransform: "none",
                                  fontSize: "12px",
                                }}
                              >
                                Take Test
                              </Button>
                            }
                          />
                        ))
                      ) : (
                        <Typography>No exams found</Typography>
                      )}
                    </Stack>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
        </Stack>
      </Stack>
      <Stack>
        <ExamHistoryResponsive />
      </Stack>
      <Stack
        sx={{
          backgroundColor: "var(--white)",
          borderRadius: "10px",
          marginTop: "10px",
        }}
      >
        <MyClassroom />
      </Stack>
    </Stack>
  );
}
