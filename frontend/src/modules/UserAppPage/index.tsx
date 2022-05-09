import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getActiveGame } from "../../apis";
import { useOpponents } from "../../context/OpponentsContext";
import { useUser } from "../../context/UserContext";
import GameStart from "../GameStart";
import TicTacToePage from "../TicTacToePage";

const UserAppPage = () => {
  const { user } = useUser();
  const { opponents, setOpponents } = useOpponents();
  const [gameType, setGameType] = useState<number>(0);
  // it nows accidentaly work as global context
  // it should be replaced with global context storing opponents for all game types

  useEffect(() => {
    getActiveGame().then((data) => {
      console.log(data.data);
      setGameType(data.data[0].type);
    });
  }, [user]);
  console.log(user);
  // const isUserSelected = () => {
  //   console.log(opponents);
  //   return opponents.filter((opp) => opp === user.data?.username);
  // };
  // console.log(isUserSelected());
  // console.log(gameType);

  return (
    <Flex justifyContent="center" alignItems="center">
      {!!gameType && gameType === 2 ? (
        <TicTacToePage />
      ) : (
        gameType === 1 && <GameStart />
      )}
    </Flex>
  );
};

export default UserAppPage;
