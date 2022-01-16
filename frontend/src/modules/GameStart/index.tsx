import { Flex } from "@chakra-ui/react";
import Pawns from "../../components/Pawns";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { useGame } from "../../context/GameContext";
import { MenuWrapper } from "../../styles";

const GameStart = () => {
  const { questions } = useGame();

  return (
    <Flex justifyContent="center" alignItems="center">
      {questions && (
        <MenuWrapper style={{ width: "75rem" }}>
          <QuestionSection />
          <GameBoard />
        </MenuWrapper>
      )}
      <Pawns />
    </Flex>
  );
};

export default GameStart;
