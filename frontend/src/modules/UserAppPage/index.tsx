import { Flex } from "@chakra-ui/react";
import { GameBoard } from "../../components/sharedcomponents/Board/GameBoard";
import { useUser } from "../../context/UserContext";

const UserAppPage = () => {
  const {user} = useUser();
  
  return (
    <Flex justifyContent="center" alignItems="center">
      {/* <GameBoard /> */}
    </Flex>
  );
};

export default UserAppPage;
