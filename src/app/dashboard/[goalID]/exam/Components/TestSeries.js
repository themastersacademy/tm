"use client";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import { East, Lock } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import StyledSelect from "@/src/Components/StyledSelect/StyledSelect";
import PlansDialogBox from "@/src/Components/PlansDialogBox/PlansDialogBox";

export default function TestSeries({ subjectOptions, isPro }) {
  const router = useRouter();
  const { goalID } = useParams();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("all");
  const [plansDialogOpen, setPlansDialogOpen] = useState(false);
  const handlePlansDialogClose = () => {
    setPlansDialogOpen(false);
  };
  const handlePlansDialogOpen = () => {
    setPlansDialogOpen(true);
  };
  const handleStartTest = async () => {
    // if (!selectedSubject) {
    //   enqueueSnackbar("Please select a subject", {
    //     variant: "error",
    //   });
    //   return;
    // }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exams/type/${goalID}/practice/create`,
      {
        method: "POST",
        body: JSON.stringify({
          subjectID: selectedSubject,
          ...(difficultyLevel !== "all" && { difficultyLevel }),
        }),
      }
    );
    const data = await response.json();
    if (data.success) {
      router.push(`/exam/${data.data.examID}/${data.data.attemptID}`);
    } else {
      console.log(data.message);
      // enqueueSnackbar(data.message, {
      //   variant: "error",
      // });
    }
  };

  const difficultyLevelOptions = [
    { label: "All", value: "all" },
    { label: "Easy", value: 0 },
    { label: "Medium", value: 1 },
    { label: "Hard", value: 2 },
  ];

  return (
    <Stack gap="15px" width="100%">
      <StyledSelect
        title="Select topic"
        options={subjectOptions}
        getLabel={(option) => option.label}
        getValue={(option) => option.value}
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
      />
      <StyledSelect
        title="Difficulty Level"
        options={difficultyLevelOptions}
        getLabel={(option) => option.label}
        getValue={(option) => option.value}
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value)}
      />
      <Button
        variant="text"
        width="100%"
        endIcon={isPro ? <East /> : <Lock />}
        onClick={isPro ? handleStartTest : handlePlansDialogOpen}
        sx={{
          textTransform: "none",
          color: "var(--primary-color)",
          fontFamily: "Lato",
          alignSelf: "center",
        }}
      >
        {isPro ? "Start Test" : "Upgrade to PRO"}
      </Button>
      <PlansDialogBox
        plansDialogOpen={plansDialogOpen}
        handlePlansDialogClose={handlePlansDialogClose}
      />
    </Stack>
  );
}
