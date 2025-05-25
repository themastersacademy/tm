import LeaderboardCard from "@/src/Components/LeaderboardCard/LeaderboardCard";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(false);
  const leaderboardList = [
    { sNo: 1, name: "Mira", points: "200 points" },
    { sNo: 2, name: "Priya", points: "180 points" },
    { sNo: 3, name: "Aarav", points: "160 points" },
    { sNo: 4, name: "Mira", points: "150 points" },
    { sNo: 5, name: "Mira", points: "140 points" },
  ];
  return (
    <Stack sx={{ display: { xs: "none", md: "block" } }}>
      <Typography
        sx={{
          fontFamily: "Lato",
          fontSize: "20px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        LeaderBoard
      </Typography>
      <Stack
        sx={{
          border: "1px solid var(--border-color)",
          borderRadius: "10px",
          backgroundColor: "var(--white)",
          width: "350px",
          minHeight: "370px",
          padding: "18px",
          gap: "10px",
        }}
      >
        {leaderboardList.map((item, index) => (
          <LeaderboardCard key={index} {...item} />
        ))}
        <Typography
          sx={{ fontFamily: "Lato", fontSize: "16px", fontWeight: "700" }}
        >
          Your Rank
        </Typography>
        <LeaderboardCard sNo={1} name="Mira" points="200 points" />
      </Stack>
    </Stack>
  );
}
