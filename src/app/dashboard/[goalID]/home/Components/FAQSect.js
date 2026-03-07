import { ExpandMore, HelpOutline } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { useState } from "react";

const faqData = [
  {
    question: "What is this platform used for?",
    answer:
      "This platform helps students prepare for competitive exams through structured courses, mock tests, and performance tracking — all in one place.",
  },
  {
    question: "Is there a free version available?",
    answer:
      "Yes, you can access limited mock tests and learning resources for free. For full access to all features, you can upgrade to a Pro plan.",
  },
  {
    question: "What does the Pro plan include?",
    answer:
      "The Pro plan gives you unlimited practice tests, the latest mock exams, group tests, advanced analytics, and priority access to new features.",
  },
  {
    question: "Are the courses included in the subscription?",
    answer:
      "Courses can be accessed independently of the free or Pro plans. They are available to all users unless marked as premium.",
  },
  {
    question: "Can I take tests on mobile devices?",
    answer:
      "Yes, our platform is compatible with mobiles, tablets, and desktops for seamless learning anywhere.",
  },
  {
    question: "Will I get solutions after the test?",
    answer:
      "Yes, detailed solutions and explanations are provided after completing each test to help you improve.",
  },
  {
    question: "Is the test pattern similar to real exams?",
    answer:
      "Absolutely. Our mock tests are designed to mirror real exam patterns, difficulty levels, and question formats.",
  },
  {
    question: "How do I track my progress?",
    answer:
      "You can view your performance stats, scores, accuracy, and rankings in your dashboard after each test.",
  },
];

export default function FAQSect() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="md">
      <Stack gap={3} alignItems="center" py={4}>
        <Stack gap="8px" width="100%" alignItems="center" textAlign="center">
          <Box
            sx={{
              p: "8px",
              borderRadius: "50%",
              bgcolor: "var(--sec-color-acc-1)",
              color: "var(--primary-color)",
              mb: 0.5,
              display: "flex",
            }}
          >
            <HelpOutline sx={{ fontSize: 24 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: { xs: "18px", md: "20px" },
              fontWeight: 700,
              color: "var(--text1)",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "13px",
              color: "var(--text3)",
              maxWidth: "500px",
            }}
          >
            Everything you need to know about our platform and services.
            Can&apos;t find the answer? Contact our support team.
          </Typography>
        </Stack>

        <Stack gap={1.5} width="100%">
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                boxShadow: "none",
                border: "1px solid",
                borderColor:
                  expanded === `panel${index}`
                    ? "var(--primary-color)"
                    : "var(--border-color)",
                borderRadius: "10px !important",
                overflow: "hidden",
                bgcolor:
                  expanded === `panel${index}`
                    ? "var(--bg-color)"
                    : "var(--white)",
                transition: "all 0.15s ease",
                "&:before": {
                  display: "none",
                },
                "&:hover": {
                  borderColor: "var(--primary-color)",
                },
                mb: "0 !important",
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMore
                    sx={{
                      color:
                        expanded === `panel${index}`
                          ? "var(--primary-color)"
                          : "var(--text3)",
                    }}
                  />
                }
                aria-controls={`faq-content-${index}`}
                id={`faq-header-${index}`}
                sx={{
                  px: { xs: 2, md: 2.5 },
                  py: 0.5,
                  "& .MuiAccordionSummary-content": {
                    my: 1.5,
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    fontWeight: 700,
                    color:
                      expanded === `panel${index}`
                        ? "var(--primary-color)"
                        : "var(--text1)",
                    transition: "color 0.15s ease",
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pb: 2.5, pt: 0 }}>
                <Typography
                  sx={{
                    fontFamily: "Lato",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "var(--text3)",
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
