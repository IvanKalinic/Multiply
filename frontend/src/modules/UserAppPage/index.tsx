import { CircularProgress, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getActiveGame } from "../../apis";
import Hangman from "../../components/Hangman";
import MemoryGame from "../../components/MemoryGame";
import Warning from "../../components/Warning";
import { useUser } from "../../context/UserContext";
import GameStart from "../../components/GameStart";
import TicTacToePage from "../../components/TicTacToePage";

const UserAppPage = () => {
  const { user } = useUser();
  const [gameType, setGameType] = useState<number>(0);
  const [componentToRender, setComponentToRender] = useState<any>();
  const [battleArrayGameType, setBattleArrayGameType] = useState<number>(0);
  const [rerenderGame, setRerenderGame] = useState(2); // 2,3,4,1

  useEffect(() => {
    getActiveGame().then((data) => {
      if (rerenderGame === 1) {
        setBattleArrayGameType(1);
        return;
      }

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
          (row: any) =>
            row.type === 5 && row.opponents.includes(user.data?.username)
        )?.battleArray;

        setBattleArrayGameType(
          battleArray.find((item: any) =>
            item.type === 2 || item.type === 1
              ? !item.winner || !item.winner.length
              : !item.winner.find((row: any) => row.name === user.data.username)
          )?.type
        );
      }
    });

    return () => {
      setBattleArrayGameType(0);
    };
  }, [rerenderGame]);

  const returnUserGame = () => {
    switch (gameType) {
      case 1:
        return (
          <GameStart
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 2:
        return (
          <TicTacToePage
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 3:
        return (
          <MemoryGame
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 4:
        return (
          <Hangman
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
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
        return (
          <GameStart
            battle={true}
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 2:
        return (
          <TicTacToePage
            battle={true}
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 3:
        return (
          <MemoryGame
            battle={true}
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 4:
        return (
          <Hangman
            battle={true}
            setRerenderGame={setRerenderGame}
            setGameType={setGameType}
          />
        );
      case 0:
        return <Warning text="There is no new games assigned to you" />;
      default:
        return <CircularProgress isIndeterminate color="green.300" />;
    }
  };

  useEffect(() => {
    setComponentToRender(returnUserGame());
  }, [gameType, battleArrayGameType, rerenderGame, setGameType]);

  return (
    <Flex justifyContent="center" alignItems="center">
      {componentToRender}
    </Flex>
  );
};

export default UserAppPage;
