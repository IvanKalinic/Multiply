import { Flex } from "@chakra-ui/react";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { useGame } from "../../context/GameContext";
import { MenuWrapper } from "../../styles";

const GameStart = () => {
  const { questions } = useGame();

  return (
    <Flex justifyContent="center" alignItems="center">
      {questions && (
        <MenuWrapper style={{ width: "1200px" }}>
          <QuestionSection />
          <GameBoard />
        </MenuWrapper>
      )}
    </Flex>
  );
};

export default GameStart;
