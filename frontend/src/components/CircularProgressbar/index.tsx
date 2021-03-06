import { Box, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { PauseButton, PlayButton } from "../../assets/icons/svgs";
import { useGame } from "../../context/GameContext";
import { useSocket } from "../../context/SocketContext";
import { useTurnBased } from "../../context/TurnBasedContext";
import { useUser } from "../../context/UserContext";
import "./index.scss";

const red = "#f54e4e";
const green = "#4aec8c";
interface Props {
  workSeconds: number;
  breakSeconds: number;
  singleGame?: boolean;
  winner?: boolean;
  setGameOver?: React.Dispatch<React.SetStateAction<boolean>>;
  setTimeSpent?: React.Dispatch<React.SetStateAction<number>>;
  setWinner?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CircularBar = ({
  workSeconds,
  breakSeconds,
  singleGame,
  winner,
  setGameOver,
  setTimeSpent,
  setWinner,
}: Props) => {
  const { myTurn, setMyTurn, hasOpponent, turnNumber } = useTurnBased();
  const { socket } = useSocket();
  const { selectedOption } = useGame();

  const [isPaused, setIsPaused] = useState(true);
  const [mode, setMode] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const secondsLeftRef = useRef(secondsLeft);
  const isPausedRef = useRef(isPaused);
  const modeRef = useRef(mode);

  const tick = () => {
    secondsLeftRef.current--;
    setSecondsLeft(secondsLeftRef.current);
    if (singleGame) setTimeSpent!(workSeconds - secondsLeftRef.current);

    if (secondsLeftRef.current === 0) {
      pause();
      if (singleGame) {
        setGameOver!(true);
      } else {
        setMyTurn((myTurn) => !myTurn);
        socket.emit("reqTurn", {
          value: "",
          room: "",
          game: "",
          question: "",
        });
      }
    }
  };

  useEffect(() => {
    if (winner) return;

    if (myTurn && (hasOpponent || !!turnNumber)) {
      play();
    }
  }, [winner, myTurn, hasOpponent, turnNumber]);

  useEffect(() => {
    if (!!selectedOption) pause();
  }, [selectedOption]);

  useEffect(() => {
    if (winner) {
      pause();
    }
  }, [winner]);

  useEffect(() => {
    if (!myTurn) return;

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
  }, [myTurn]);

  const totalSeconds = mode === "work" ? workSeconds : breakSeconds;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const play = () => {
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const pause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  useEffect(() => {
    if (winner) return;

    if (singleGame) {
      play();
    }
  }, [singleGame, play, winner]);

  useEffect(() => {
    if (singleGame && workSeconds - secondsLeftRef.current === 0) {
      setWinner!(false);
    }
  }, [singleGame, workSeconds, secondsLeft]);

  return (
    <Flex
      w="15rem"
      h="15rem"
      flexDirection="column-reverse"
      justifyContent="center"
      alignItems="center"
      position="fixed"
      left="-3rem"
      bottom="11vh"
    >
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
        {!singleGame &&
          (isPaused ? (
            myTurn && <PlayButton onClick={play} />
          ) : (
            <PauseButton onClick={pause} />
          ))}
      </Box>
    </Flex>
  );
};
