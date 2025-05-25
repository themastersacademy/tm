import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import mastersLogo from "@/public/images/masters-logo.svg";

export default function MasterLogo({ isSideNavOpen }) {
  const router = useRouter();
  return (
    <Stack
      sx={{
        flexDirection: "row",
        gap: "15px",
      }}
    >
      <Image
        src={mastersLogo}
        alt="logo"
        width={60}
        height={26}
        onClick={() => router.push("/signIn")}
      />
      {!isSideNavOpen && (
        <Typography
          sx={{
            fontFamily: "Lato",
            fontSize: "14px",
            fontWeight: "700",
            letterSpacing: "0.3px",
            color: "var(--primary-color)",
            whiteSpace: "nowrap",
            display:{xs:"none",md:"block"},
          }}
        >
          {process.env.NEXT_PUBLIC_COMPANY_NAME}
        </Typography>
      )}
    </Stack>
  );
}