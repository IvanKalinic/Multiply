import React, { createContext, useContext, useState, useMemo } from "react";

type ContextType = {
  opponents: Array<any>;
  setOpponents: React.Dispatch<React.SetStateAction<Array<any>>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
};

const TicTacToeContext = createContext<ContextType>({
  opponents: [],
  setOpponents: () => null,
  room: "",
  setRoom: () => null,
});

export const useTicTacToe = () => {
  const ticTacToeContext = useContext(TicTacToeContext);

  if (ticTacToeContext === undefined) {
    throw new Error("useTicTacToe must be inside of its provider");
  }
  return ticTacToeContext;
};

interface Props {
  children: React.ReactChild;
}

export const TicTacToeProvider = ({ children }: Props) => {
  const [opponents, setOpponents] = useState<Array<any>>([]);
  const [room, setRoom] = useState<string>("");

  const value = useMemo(
    () => ({
      opponents,
      setOpponents,
      room,
      setRoom,
    }),
    [opponents, setOpponents, room, setRoom]
  );

  return (
    <TicTacToeContext.Provider value={value}>
      {children}
    </TicTacToeContext.Provider>
  );
};
