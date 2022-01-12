import React, { createContext, useContext, useState } from "react";

type ContextType = {
  displayWin: boolean;
  setDisplayWin: React.Dispatch<React.SetStateAction<boolean>>;
  questions: Array<any>;
  setQuestions: React.Dispatch<React.SetStateAction<Array<any>>>;
};

const GameContext = createContext<ContextType>({
  displayWin: false,
  setDisplayWin: () => null,
  questions: [],
  setQuestions: () => null,
});

export const useGame = () => {
  const gameContext = useContext(GameContext);

  if (gameContext === undefined) {
    throw new Error("useAuth must be inside of its provider");
  }
  return gameContext;
};

interface Props {
  children: React.ReactChild;
}

export const GameProvider = ({ children }: Props) => {
  const [displayWin, setDisplayWin] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Array<any>>([]);

  const value = { displayWin, setDisplayWin, questions, setQuestions };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
