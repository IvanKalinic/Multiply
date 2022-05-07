import React, { createContext, useContext, useState, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type ContextType = {
  displayWin: boolean;
  setDisplayWin: React.Dispatch<React.SetStateAction<boolean>>;
  questions: Array<any>;
  setQuestions: React.Dispatch<React.SetStateAction<Array<any>>>;
  selectedNumber: number;
  setSelectedNumber: React.Dispatch<React.SetStateAction<number>>;
  maxClicks: number;
  setMaxClicks: React.Dispatch<React.SetStateAction<number>>;
  absentItem: boolean;
  setAbsentItem: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameContext = createContext<ContextType>({
  displayWin: false,
  setDisplayWin: () => null,
  questions: [],
  setQuestions: () => null,
  selectedNumber: 0,
  setSelectedNumber: () => 0,
  maxClicks: 0,
  setMaxClicks: () => 0,
  absentItem: false,
  setAbsentItem: () => null,
});

export const useGame = () => {
  const gameContext = useContext(GameContext);

  if (gameContext === undefined) {
    throw new Error("useGame must be inside of its provider");
  }
  return gameContext;
};

interface Props {
  children: React.ReactChild;
}

export const GameProvider = ({ children }: Props) => {
  const [displayWin, setDisplayWin] = useState<boolean>(false);
  const [questions, setQuestions] = useLocalStorage("questions", []);
  const [selectedNumber, setSelectedNumber] = useState<number>(0);
  const [maxClicks, setMaxClicks] = useState<number>(0);
  const [absentItem, setAbsentItem] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      displayWin,
      setDisplayWin,
      questions,
      setQuestions,
      selectedNumber,
      setSelectedNumber,
      maxClicks,
      setMaxClicks,
      absentItem,
      setAbsentItem,
    }),
    [
      displayWin,
      setDisplayWin,
      questions,
      setQuestions,
      selectedNumber,
      setSelectedNumber,
      maxClicks,
      setMaxClicks,
      absentItem,
      setAbsentItem,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
