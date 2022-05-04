import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getActiveGame } from "../../apis";
import { useOpponents } from "../../context/OpponentsContext";
import { useUser } from "../../context/UserContext";
import GameStart from "../GameStart";
import TicTacToePage from "../TicTacToePage";

const UserAppPage = () => {
  const { user } = useUser();
  const { opponents } = useOpponents();
  const [gameType, setGameType] = useState<number>(1);
  // it nows accidentaly work as global context
  // it should be replaced with global context storing opponents for all game types
  const isUserSelected = () => {
    return !!opponents.filter((opp) => opp === user.name);
  };

  useEffect(() => {
    getActiveGame().then((data) => setGameType(data.data[0].type));
  }, [user]);

  console.log(isUserSelected());
  console.log(gameType);

  return (
    <Flex justifyContent="center" alignItems="center">
      {!!gameType &&
        isUserSelected() &&
        (gameType === 2 ? <TicTacToePage /> : <GameStart />)}
    </Flex>
  );
};

export default UserAppPage;
