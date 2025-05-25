import { Button, Stack, Typography } from "@mui/material";
import Image from "next/image";
import practiceTest from "@/public/images/practiceExam.svg";

export default function ExamGroups({ handleOpen }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "var(--white)",
        gap: "10px",
        width: "500px",
        padding: "15px",
      }}
    >
      <Stack
        sx={{
          gap: "10px",
          width: "400px",
        }}
      >
        <Stack gap="10px">
          <Typography
            component="div"
            sx={{ fontFamily: "Lato", fontSize: "13px", width: "300px" }}
          >
            Sharpen your skills with practice tests designed to boost accuracy,
            build confidence, and prepare you for real exam scenarios.
          </Typography>
          <Typography sx={{ fontFamily: "Lato", fontSize: "14px" }}>
            100+ learners competing
          </Typography>
          <Stack>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                backgroundColor: "var(--primary-color)",
                width: "300px",
              }}
              onClick={handleOpen}
            >
              Attempt(1/10)
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Stack>
        <Image src={practiceTest} alt="exam-group" />
      </Stack>
    </Stack>
  );
}
