import { Avatar, Button, Stack, Typography } from "@mui/material";
import examGroupBanner from "@/public/images/examGroupBanner.svg";
import Image from "next/image";

export default function ExamGroupCard() {
  return (
    <Stack
      flexDirection={{ xs: "column", md: "row" }}
      sx={{
        border: "1px solid var(--border-color)",
        borderRadius: "5px",
        backgroundColor: "var(--white)",
        padding: { xs: "12px", md: "15px" },
        width: "100%",
        maxWidth: { md: "600px" },
        gap: { xs: "15px", md: "20px" },
      }}
    >
      <Stack gap={{ xs: "10px", md: "15px" }} flex={1}>
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
      <Stack
        sx={{
          marginLeft: { xs: "0", md: "auto" },
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={examGroupBanner} alt="" width={120} height={120} />
      </Stack>
    </Stack>
  );
}
