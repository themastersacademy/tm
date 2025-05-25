import { East } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import mocks from "@/public/icons/mocks.svg";
import PrimaryCard from "@/src/Components/PrimaryCard/PrimaryCard";

export default function FreeTest() {
  const goalDetails = [
    {
      title: "GATE CS Mock Test",
      icon: mocks.src,
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
            padding: "2px",
          }}
        >
          Start now
        </Button>
      ),
    },
    {
      title: "Banking Mock Test ",
      icon: mocks.src,
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
            padding: "2px",
          }}
        >
          Start now
        </Button>
      ),
    },
    {
      title: "Banking Mock Test ",
      icon: mocks.src,
      actionButton: (
        <Button
          variant="text"
          endIcon={<East />}
          sx={{
            textTransform: "none",
            fontFamily: "Lato",
            color: "var(--primary-color)",
            fontSize: "12px",
            padding: "2px",
          }}
        >
          Start now
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
      <Stack gap="10px" flexDirection="row" flexWrap="wrap" width="100%">
        {goalDetails.map((item, index) => (
          <PrimaryCard key={index} {...item} />
        ))}
      </Stack>
    </Box>
  );
}
