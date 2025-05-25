import { Card, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function PrimaryCard({
  icon,
  title,
  subtitle,
  actionButton,
  enrolled,
}) {
  return (
    <Card
      sx={{
        width: "150px",
        minHeight: "200px",
        border: enrolled
          ? "2px solid var(--primary-color)"
          : "1px solid var(--border-color)",
        borderColor: "var(--border-color)",
        padding: "20px 10px 10px 10px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
      elevation={0}
    >
      <Stack alignItems="center" gap="7px">
        <Stack
          sx={{
            width: "75px",
            height: "75px",
            backgroundColor: "var(--sec-color-acc-1)",
            borderRadius: "15px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={icon} alt="icon" width={26} height={26} />
        </Stack>
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
            textWrap:"wrap"
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontFamily: "Lato",
              fontSize: "12px",
              fontWeight: "400",
              color: "var(--text4)",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
      <Stack sx={{ marginTop: "auto" }}>{actionButton}</Stack>
    </Card>
  );
}
