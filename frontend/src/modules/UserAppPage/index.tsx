import React from "react";
import { Flex } from "@chakra-ui/react";
import { GameBoard } from "../../components/sharedcomponents/Board/GameBoard";

const UserAppPage = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <GameBoard />
    </Flex>
  );
};

export default UserAppPage;
