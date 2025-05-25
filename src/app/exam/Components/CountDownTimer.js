"use client";
import { Skeleton, Stack, Typography } from "@mui/material";
import Countdown from "react-countdown";
// import { useEffect, useRef } from "react";
export default function CountDownTimer({
  date,
  now,
  loading,
  basicStyled,
  onComplete,
  promptTimeOver,
}) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    hours = hours + days * 24;
    const arrayWithKeys = [
      { value: hours, key: "hours" },
      { value: minutes, key: "min" },
      { value: seconds, key: "sec" },
    ];

    if (completed) {
      onComplete("AUTO");
      return (
        <Stack flexDirection="row" gap="10px" alignItems="center">
          <Typography>{promptTimeOver}</Typography>
        </Stack>
      );
    }

    const formatTime = (time) => time.toString().padStart(2, "0");

    if (basicStyled) {
      return (
        <Stack flexDirection="row" gap="2px" alignItems="center">
          <Typography>{`${formatTime(arrayWithKeys[0].value)}h : ${formatTime(
            arrayWithKeys[1].value
          )}m : ${formatTime(arrayWithKeys[2].value)}s`}</Typography>
        </Stack>
      );
    } else {
      return (
        <Stack flexDirection="row" gap="10px" alignItems="center">
          {arrayWithKeys.map((item, index) => (
            <Stack
              flexDirection="column"
              gap={1}
              alignItems="center"
              key={index}
            >
              <Typography
                variant="h6"
                width={"40px"}
                height={"40px"}
                bgcolor={"var(--sec-color-acc-1)"}
                borderRadius={2}
                color={"var(--sec-color)"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ fontSize: "20px" }}
              >
                {formatTime(item.value)}
              </Typography>
              <Typography variant="p" sx={{ fontSize: "12px" }}>
                {item.key}
              </Typography>
            </Stack>
          ))}
        </Stack>
      );
    }
  };

  return (
    <Stack
      gap="10px"
      alignItems="center"
      height={basicStyled ? "auto" : "60px"}
    >
      {loading ? (
        !basicStyled ? (
          <Stack
            flexDirection="row"
            height="60px"
            gap="10px"
            alignItems="center"
            justifyContent="center"
          >
            {[{ key: "hours" }, { key: "min" }, { key: "sec" }].map((item) => (
              <Stack key={item.key} flexDirection="column" alignItems="center">
                <Skeleton
                  sx={{
                    width: "40px",
                    height: "60px",
                    borderRadius: "5px",
                    color: "var(--sec-color)",
                    bgcolor: "var(--sec-color-acc-1)",
                  }}
                />
                <Typography variant="p" sx={{ fontSize: "12px" }}>
                  {item.key}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : (
          <Stack flexDirection="row" gap="2px" alignItems="center">
            <Typography>00h : 00m : 00s</Typography>
          </Stack>
        )
      ) : (
        <Countdown
          date={date}
          daysInHours={true}
          renderer={renderer}
          now={now}
        />
      )}
    </Stack>
  );
}
