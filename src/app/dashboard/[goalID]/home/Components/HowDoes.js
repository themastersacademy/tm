import { Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function HowDoes({ image, title, description }) {
  return (
    <Stack>
      <Stack
        sx={{
          width: "300px",
          height: "350px",
          borderRadius: "15px",
          backgroundColor: "var(--white)",
          padding: "30px 15px",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Image src={image} alt="image" width={120} height={120} />
        </Stack>
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "20px", fontWeight: "700" }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "12px",
            textAlign: "center",
            lineHeight: "22px",
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
}
