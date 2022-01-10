import React, { createContext, useContext, useState } from "react";

type ContextType = {
  displayWin: boolean;
  setDisplayWin: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameContext = createContext<ContextType>({
  displayWin: false,
  setDisplayWin: () => null,
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

  const value = { displayWin, setDisplayWin };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
