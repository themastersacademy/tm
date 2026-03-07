import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import SignInBanner1 from "@/public/images/signInBanner1.svg";
import SchoolIcon from "@mui/icons-material/School";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function SignInBanner() {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100vh",
        background: "linear-gradient(160deg, #187163 0%, #0d4a40 50%, #134e44 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle decorative circles */}
      <Stack
        sx={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />
      <Stack
        sx={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />

      <Stack
        justifyContent="center"
        alignItems="center"
        gap={4}
        sx={{ maxWidth: "400px", px: 4, zIndex: 1 }}
      >
        <Image
          src={SignInBanner1}
          alt="banner"
          width={320}
          height={280}
          style={{ objectFit: "contain" }}
        />

        <Typography
          sx={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Your learning journey starts here
        </Typography>

        <Stack gap={2} width="100%">
          {[
            { icon: <SchoolIcon sx={{ fontSize: 18 }} />, text: "Expert-curated courses & study materials" },
            { icon: <AutoStoriesIcon sx={{ fontSize: 18 }} />, text: "Practice tests with detailed analysis" },
            { icon: <EmojiEventsIcon sx={{ fontSize: 18 }} />, text: "Track progress & ace your exams" },
          ].map((item, i) => (
            <Stack
              key={i}
              direction="row"
              alignItems="center"
              gap={1.5}
              sx={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "10px 14px",
              }}
            >
              <Stack
                sx={{
                  color: "var(--sec-color)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {item.icon}
              </Stack>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {item.text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
