import { Stack } from "@mui/material";
import SecondaryCard from "../SecondaryCard/SecondaryCard";
import question from "@/public/icons/question.svg";
import Image from "next/image";
import QuestionPreview from "@/src/app/exam/Components/QuestionPreview";

export default function ResultSection({
  sections,
  answerList,
  userAnswerList,
  startIndex ,
}) {
  console.log(startIndex);
  return (
    <Stack gap="20px">
      <SecondaryCard
        icon={
          <Image src={question} alt="question" width={25} height={25} />
        }
        title={sections.title}
      />
      <Stack gap="10px">
        {sections.questions.map((question, index) => (
          <QuestionPreview
            key={index}
            qNum={startIndex + index + 1}
            result={question}
            userAnswerList={userAnswerList}
            answerList={answerList}
          />
        ))}
      </Stack>
    </Stack>
  );
}
