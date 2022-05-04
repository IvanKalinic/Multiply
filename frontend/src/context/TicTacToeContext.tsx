import React, { createContext, useContext, useState, useMemo } from "react";

type ContextType = {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
};

const TicTacToeContext = createContext<ContextType>({
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
  const [room, setRoom] = useState<string>("");

  const value = useMemo(
    () => ({
      room,
      setRoom,
    }),
    [room, setRoom]
  );

  return (
    <TicTacToeContext.Provider value={value}>
      {children}
    </TicTacToeContext.Provider>
  );
};
