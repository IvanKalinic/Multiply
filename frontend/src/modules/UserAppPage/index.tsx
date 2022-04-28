import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getActiveGame } from "../../apis";
import { useTicTacToe } from "../../context/TicTacToeContext";
import { useUser } from "../../context/UserContext";
import GameStart from "../GameStart";
import TicTacToePage from "../TicTacToePage";

const UserAppPage = () => {
  const { user } = useUser();
  const { opponents } = useTicTacToe();
  const [gameType, setGameType] = useState<number>(0);

  const isUserSelected = () => {
    return !!opponents.filter((opp) => opp === user.name);
  };

  useEffect(() => {
    getActiveGame().then((data) => setGameType(data.data[0].type));
  }, [user]);

  return (
    <Flex justifyContent="center" alignItems="center">
      {isUserSelected() && gameType === 2 ? <GameStart /> : <TicTacToePage />}
    </Flex>
  );
};

export default UserAppPage;
