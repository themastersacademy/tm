import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import institute from "@/public/icons/institute1.svg";
import banking from "@/public/icons/banking.svg";
import aGrade from "@/public/icons/aGrade.svg";
import book from "@/public/icons/book.svg";

const infoData = [
  { icon: institute, label: "Trained Students", value: "1,00,000 +" },
  { icon: aGrade, label: "Tests Attempted", value: "70K+" },
  { icon: book, label: "Courses Accessed", value: "60+" },
  { icon: banking, label: "Institutions", value: "30" },
];

export default function InfoCard() {
  return (
    <Stack
      flexDirection="row"
      flexWrap="wrap"
      alignItems="center"
      gap="5px"
      sx={{
        borderRadius: "6px",
        backgroundColor: "var(--white)",
        padding: "10px",
        minHeight: "100px",
      }}
      width="100%"
      maxWidth="1200px"
    >
      {infoData.map((item, index) => (
        <Stack
          key={index}
          flexDirection="row"
          alignItems="center"
          gap={1.5}
          sx={{
            flex: { xs: "1 1 100%", sm: "1 1 45%", md: "1 1 22%" },
            padding: "10px",
          }}
        >
          <Stack
            sx={{
              width: "60px",
              height: "60px",
              backgroundColor: "var(--sec-color-acc-1)",
              borderRadius: "15px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={34}
              height={28}
            />
          </Stack>
          <Stack>
            <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: "700" }}>
              {item.value}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
