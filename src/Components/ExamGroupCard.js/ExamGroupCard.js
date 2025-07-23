import { Avatar, Button, Stack, Typography } from "@mui/material";
import examGroupBanner from "@/public/images/examGroupBanner.svg";
import Image from "next/image";

export default function ExamGroupCard() {
  return (
    <Stack
      flexDirection="row"
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "5px",
        backgroundColor: "var(--white)",
        padding: "15px",
        width: "600px",
        gap: "20px",
      }}
    >
      <Stack gap="15px">
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
        >
          Weekly Test
        </Typography>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "600" }}
        >
          Attempt the weekly test & unlock your rewards!
        </Typography>
        <Stack flexDirection="row" alignItems="center">
          <Avatar
            sx={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              zIndex: 1,
            }}
          />
          <Avatar
            sx={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              top: 0,
              right: 10,
              zIndex: 1,
            }}
          />
          <Avatar
            sx={{
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              top: 0,
              right: 20,
              zIndex: 1,
            }}
          />
          <Typography
            sx={{ fontFamily: "Lato", fontSize: "10px", fontWeight: "500" }}
          >
            100+ learners competing
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--primary-color)",
            textTransform: "none",
            marginTop: "auto",
            fontFamily: "Lato",
          }}
          disableElevation
        >
          Attempt
        </Button>
      </Stack>
      <Stack sx={{ marginLeft: "auto" }}>
        <Image src={examGroupBanner} alt="" width={155} height={155} />
      </Stack>
    </Stack>
  );
}
