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
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Image
        src={mastersLogo}
        alt="logo"
        width={36}
        height={36}
        onClick={() => router.push("/signIn")}
        style={{ cursor: "pointer" }}
      />
      {!isSideNavOpen && (
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--primary-color)",
            whiteSpace: "nowrap",
          }}
        >
          {process.env.NEXT_PUBLIC_COMPANY_NAME}
        </Typography>
      )}
    </Stack>
  );
}
