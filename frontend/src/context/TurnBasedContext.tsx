import React, { createContext, useContext, useState, useMemo } from "react";

type ContextType = {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  opponents: Array<any>;
  setOpponents: React.Dispatch<React.SetStateAction<Array<any>>>;
  turnNumber: number;
  setTurnNumber: React.Dispatch<React.SetStateAction<number>>;
  game: Array<any>;
  setGame: React.Dispatch<React.SetStateAction<Array<any>>>;
  player: string;
  setPlayer: React.Dispatch<React.SetStateAction<string>>;
  myTurn: boolean;
  setMyTurn: React.Dispatch<React.SetStateAction<boolean>>;
  hasOpponent: boolean;
  setHasOpponent: React.Dispatch<React.SetStateAction<boolean>>;
  playerType: string;
  setPlayerType: React.Dispatch<React.SetStateAction<string>>;
  winner: boolean;
  setWinner: React.Dispatch<React.SetStateAction<boolean>>;
};

const TurnBasedContext = createContext<ContextType>({
  room: "",
  setRoom: () => null,
  opponents: [],
  setOpponents: () => null,
  turnNumber: 0,
  setTurnNumber: () => null,
  game: [],
  setGame: () => null,
  player: "",
  setPlayer: () => null,
  myTurn: false,
  setMyTurn: () => null,
  hasOpponent: false,
  setHasOpponent: () => null,
  playerType: "me",
  setPlayerType: () => null,
  winner: false,
  setWinner: () => null,
});

export const useTurnBased = () => {
  const turnBasedContext = useContext(TurnBasedContext);

  if (turnBasedContext === undefined) {
    throw new Error("useTurnBased must be inside of its provider");
  }
  return turnBasedContext;
};

interface Props {
  children: React.ReactChild;
}

export const TurnBasedProvider = ({ children }: Props) => {
  const [room, setRoom] = useState<string>("");
  const [opponents, setOpponents] = useState<Array<any>>([]);
  const [player, setPlayer] = useState<string>("");
  const [game, setGame] = useState<Array<any>>([]);
  const [turnNumber, setTurnNumber] = useState<number>(0);
  const [myTurn, setMyTurn] = useState<boolean>(true);
  const [playerType, setPlayerType] = useState<string>("me");
  const [hasOpponent, setHasOpponent] = useState<boolean>(false);
  const [winner, setWinner] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      room,
      setRoom,
      opponents,
      setOpponents,
      turnNumber,
      setTurnNumber,
      game,
      setGame,
      player,
      setPlayer,
      myTurn,
      setMyTurn,
      hasOpponent,
      setHasOpponent,
      playerType,
      setPlayerType,
      winner,
      setWinner,
    }),
    [
      room,
      setRoom,
      opponents,
      setOpponents,
      turnNumber,
      setTurnNumber,
      game,
      setGame,
      player,
      setPlayer,
      myTurn,
      setMyTurn,
      hasOpponent,
      setHasOpponent,
      playerType,
      setPlayerType,
      winner,
      setWinner,
    ]
  );

  return (
    <TurnBasedContext.Provider value={value}>
      {children}
    </TurnBasedContext.Provider>
  );
};
