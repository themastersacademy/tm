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
        {practiceTest.map((item, index) => (
          <Box key={index} sx={{ flex: "0 0 auto", width: "150px" }}>
            <PrimaryCard {...item} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
