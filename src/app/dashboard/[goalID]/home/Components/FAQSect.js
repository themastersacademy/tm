import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const faqData = [
  {
    question: " What is this platform used for?",
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
    question: " Is the test pattern similar to real exams?",
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

  return (
    <Container maxWidth="md">
      <Stack gap={3} alignItems="center" py={4}>
        <Stack gap="5px" width="100%" alignItems="center">
          <Typography
            fontWeight={700}
            sx={{
              fontFamily: "Lato",
              fontSize: isMobile ? "22px" : "28px",
              textAlign: "center",
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: isMobile ? "14px" : "16px",
              color: "var(--text3)",
            }}
          >
            Have questions? We’ve got answers.
          </Typography>
        </Stack>

        <Stack gap={1} width="100%">
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                boxShadow: "none",
                border: "1px solid var(--border-color)",
                borderRadius: "5px",
                "&::before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`faq-content-${index}`}
                id={`faq-header-${index}`}
              >
                <Typography sx={{ fontFamily: "Lato" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontFamily: "Lato", fontSize: "16px" }}>
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
