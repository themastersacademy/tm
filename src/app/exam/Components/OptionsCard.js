"use client";
import MDPreview from "@/src/Components/MarkdownPreview/MarkdownPreview";
import StyledTextField from "@/src/Components/StyledTextField/StyledTextField";
import { Radio, Stack } from "@mui/material";
import { useState, useEffect } from "react";

export function OptionsCard({ option, selectedOptions, onSelect }) {
  return (
    <Stack gap="20px" width="100%">
      {option.map((option, index) => {
        const isSelected = selectedOptions?.includes(option.id) || false;
        return (
          <Stack
            key={index}
            gap="10px"
            sx={{
              border: isSelected
                ? "1px solid var(--text3)"
                : "1px solid var(--border-color)",
              padding: "10px",
              minWidth: "300px",
              width: "auto",
              maxWidth: "700px",
              minHeight: "70px",
              borderRadius: "5px",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => onSelect(option.id)}
          >
            <Stack flexDirection="row" alignItems="center" gap="10px">
              {
                <Radio
                  checked={isSelected}
                  onClick={() => onSelect(option.id)}
                  sx={{
                    color: "var(--border-color)",
                    padding: "0px",
                    "&.Mui-checked": { color: "var(--text3)" },
                  }}
                />
              }
              <MDPreview value={option?.text} />
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

export function FIBOptionsCard({ onChange, value, noOfBlanks }) {
  const [blankAnswers, setBlankAnswers] = useState(value || []);

  useEffect(() => {
    setBlankAnswers(value || []);
  }, [value]);

  return (
    <Stack gap="15px">
      {Array.from({ length: noOfBlanks }, (_, i) => (
        <StyledTextField
          key={i}
          onBlur={() => {
            onChange({ value: blankAnswers[i], blankIndex: i });
          }}
          onChange={(e) => {
            const newBlankAnswers = [...blankAnswers];
            newBlankAnswers[i] = e.target.value;
            setBlankAnswers(newBlankAnswers);
          }}
          placeholder="Enter your answer"
          value={blankAnswers[i] || ""}
        />
      ))}
    </Stack>
  );
}
