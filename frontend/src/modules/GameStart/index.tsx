import { Flex } from "@chakra-ui/react";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { MenuWrapper } from "../../styles";

const GameStart = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <MenuWrapper style={{ width: "1200px" }}>
        <QuestionSection />
        <GameBoard />
      </MenuWrapper>
    </Flex>
  );
};

export default GameStart;
