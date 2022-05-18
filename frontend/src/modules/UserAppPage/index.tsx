import { CircularProgress, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getActiveGame } from "../../apis";
import Hangman from "../../components/Hangman";
import { useOpponents } from "../../context/OpponentsContext";
import { useUser } from "../../context/UserContext";
import MemoryGame from "../Games/MemoryGame";
import GameStart from "../GameStart";
import TicTacToePage from "../TicTacToePage";
import { useLocation } from "react-router-dom";
import Warning from "../../components/Warning";

const UserAppPage = () => {
  const { user } = useUser();
  const [gameType, setGameType] = useState<number>(0);
  const [componentToRender, setComponentToRender] = useState<any>();
  // const location = useLocation();
  // it nows accidentaly work as global context
  // it should be replaced with global context storing opponents for all game types

  useEffect(() => {
    getActiveGame().then((data) => {
      console.log(data.data);

      let foundGameType = data.data.find((row: any) => {
        if (
          (!!row?.opponents?.length &&
            row.opponents.includes(user.data?.username) &&
            !row?.winner) ||
          (!!row?.user && row.user === user.data?.username && !row?.winner)
        ) {
          return row.type;
        }
      })?.type;

      if (!!foundGameType) setGameType(foundGameType);
    });
  }, []);

  // console.log(location);
  console.log(gameType);

  const returnUserGame = () => {
    switch (gameType) {
      case 1:
        return <GameStart />;
      case 2:
        return <TicTacToePage />;
      case 3:
        return <MemoryGame />;
      case 4:
        return <Hangman />;
      case 0:
        return <Warning text="There is no new games assigned to you" />;
      default:
        return <CircularProgress isIndeterminate color="green.300" />;
    }
  };

  useEffect(() => {
    setComponentToRender(returnUserGame());
  }, [gameType]);

  return (
    <Flex justifyContent="center" alignItems="center">
      {componentToRender}
    </Flex>
  );
};

export default UserAppPage;
