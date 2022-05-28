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
  const [battleArrayGameType, setBattleArrayGameType] = useState<number>(0);
  const [rerenderGame, setRerenderGame] = useState(2); // 2,3,4,1
  // const location = useLocation();
  // it nows accidentaly work as global context
  // it should be replaced with global context storing opponents for all game types

  useEffect(() => {
    getActiveGame().then((data) => {
      console.log(data.data);

      //logika za battle
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

      if (foundGameType === 5) {
        let battleArray = data.data.find(
          (row: any) => row.type === 5
        )?.battleArray;
        setBattleArrayGameType(
          battleArray.find((item: any) => !item.winner)?.type
        );
      }
    });
  }, [rerenderGame]);

  // console.log(location);
  console.log(rerenderGame);
  console.log(gameType);
  console.log(battleArrayGameType);

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
      case 5:
        return returnNextGame();
      case 0:
        return <Warning text="There is no new games assigned to you" />;
      default:
        return <CircularProgress isIndeterminate color="green.300" />;
    }
  };

  const returnNextGame = () => {
    switch (battleArrayGameType) {
      case 1:
        return <GameStart battle={true} setRerenderGame={setRerenderGame} />;
      case 2:
        return (
          <TicTacToePage battle={true} setRerenderGame={setRerenderGame} />
        );
      case 3:
        return <MemoryGame battle={true} setRerenderGame={setRerenderGame} />;
      case 4:
        return <Hangman battle={true} setRerenderGame={setRerenderGame} />;
      case 0:
        return <Warning text="There is no new games assigned to you" />;
      default:
        return <CircularProgress isIndeterminate color="green.300" />;
    }
  };

  useEffect(() => {
    setComponentToRender(returnUserGame());
  }, [gameType, battleArrayGameType]);

  return (
    <Flex justifyContent="center" alignItems="center">
      {componentToRender}
    </Flex>
  );
};;;;

export default UserAppPage;
