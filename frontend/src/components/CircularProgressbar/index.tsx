import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { PauseButton, PlayButton } from "../../assets/icons/svgs";
import "./index.scss";

const red = "#f54e4e";
const green = "#4aec8c";
const workSeconds = 10;
const breakSeconds = 5;

export const CircularBar = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
  };

  useEffect(() => {
    const switchMode = () => {
      const nextMode = modeRef.current === "work" ? "break" : "work";
      const nextSeconds = nextMode === "work" ? workSeconds : breakSeconds;

      setMode(nextMode);
      modeRef.current = nextMode;

      setSecondsLeft(nextSeconds);
      secondsLeftRef.current = nextSeconds;
    };

    secondsLeftRef.current = workSeconds;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (!secondsLeftRef.current) {
        return switchMode();
      }

      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalSeconds = mode === "work" ? workSeconds : breakSeconds;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  return (
    <Flex w="20rem" h="20rem">
      <CircularProgressbar
        value={percentage}
        text={`${secondsLeft}`}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: mode === "work" ? red : green,
          trailColor: "rgba(255,255,255,.2)",
        })}
      />
      <Box mt="20" w="20" h="20">
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
      </Box>
    </Flex>
  );
};
