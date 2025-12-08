import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";
import { East } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import gate_cse from "@/public/icons/gate_cse.svg";

export default function PracticeTest() {
  const practiceTest = [
    {
      title: "GATE CSE",
      icon: gate_cse.src,
      subtitle: "Top 5 Questions Quiz",
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          Take Test
        </Button>
      ),
    },
    {
      title: "Banking",
      icon: gate_cse.src,
      subtitle: "Programming Quiz",
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          Take Test
        </Button>
      ),
    },
    {
      title: "Placements",
      icon: gate_cse.src,
      subtitle: "Digital Logic Quiz",
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
          }}
        >
          Take Test
        </Button>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fill, minmax(280px, 1fr))",
          md: "repeat(auto-fill, minmax(300px, 1fr))",
        },
        gap: "20px",
        width: "100%",
      }}
    >
      {practiceTest.map((item, index) => (
        <PrimaryCard key={index} {...item} />
      ))}
    </Box>
  );
}
