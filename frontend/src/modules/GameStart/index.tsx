import { Flex } from "@chakra-ui/react";
import React from "react";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";

const GameStart = () => {
  return (
    <Flex>
      <QuestionSection />
      <GameBoard />
    </Flex>
  );
};

export default GameStart;
