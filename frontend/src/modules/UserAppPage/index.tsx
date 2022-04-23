import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { GameBoard } from "../../components/sharedcomponents/Board/GameBoard";
import { useTicTacToe } from "../../context/TicTacToeContext";
import { useUser } from "../../context/UserContext";
import TicTacToePage from "../TicTacToePage";

const UserAppPage = () => {
  const { user } = useUser();
  const { opponents } = useTicTacToe();

  const isUserSelected = () => {
    return !!opponents.filter((opp) => opp === user.name);
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      {isUserSelected() && <TicTacToePage />}
    </Flex>
  );
};

export default UserAppPage;
