"use client";
import { East } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";

export default function ExamHistoryResponsive() {
  const router = useRouter();
  const params = useParams();
  const goalID = params.goalID;
  return (
    <Stack padding={{ xs: "10px", md: "20px" }} gap="20px">
      <Stack
        sx={{
          border: "1px solid var(--border-color)",
          padding: "20px",
          backgroundColor: "var(--white)",
          borderRadius: "10px",
          gap: "20px",
        }}
      >
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
          >
            Exam History
          </Typography>
          <Stack sx={{ display: { xs: "block", md: "none" } }}>
            <Button
              variant="text"
              endIcon={<East />}
              onClick={() => router.push(`/dashboard/${goalID}/history`)}
              sx={{
                textTransform: "none",
                color: "var(--primary-color)",
                fontFamily: "Lato",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
              View All
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
