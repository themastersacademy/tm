import { Card, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function StatisticCard({ icon, title, count }) {
  return (
    <Card
      sx={{
        minWidth: { xs: "160px", md: "170px" },
        maxHeight: "100px",
        padding: "20px 16px",
        border: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px",
      }}
      elevation={0}
    >
      <Stack flexDirection="row" gap="10px" minHeight="35px">
        <Stack
          sx={{
            backgroundColor: "var(--sec-color-acc-1)",
            width: "22px",
            height: "22px",
            borderRadius: "50px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={icon} alt="icon" width={12} height={12} />
        </Stack>

        <Typography
          sx={{ fontFamily: "Lato", fontSize: "14px", fontWeight: "700" }}
        >
          {title}
        </Typography>
      </Stack>
      <Typography
        sx={{ fontFamily: "Lato", fontSize: "28px", fontWeight: "700" }}
      >
        {count || 0}
      </Typography>
    </Card>
  );
}
