import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useGame } from "../../../../context/GameContext";
import { MenuWrapper } from "../../../../styles";
import { Details } from "../../styles";
import QuestionItem from "../QuestionItem";
interface Props {
  currentQuestionFromOpponent: number;
}

export const QuestionSection = ({ currentQuestionFromOpponent }: Props) => {
  const { questions } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<number>(
    currentQuestionFromOpponent
  );

  useEffect(() => {
    setCurrentQuestion(currentQuestionFromOpponent);

    return () => {
      setCurrentQuestion(-1);
    };
  }, [currentQuestionFromOpponent]);

  return (
    <Box>
      {!!questions.length && (
        <MenuWrapper
          style={{
            marginLeft: "-1.875rem",
            width: "30vw",
            height: "50vh",
            marginRight: "4rem",
            flexDirection: "column",
            marginTop: "-0.625rem",
          }}
        >
          <Details>
            <Flex flexDirection="column" alignItems="flex-start">
              <Text>
                Category: <strong>{questions[0]?.category}</strong>
              </Text>
              <Text>
                Level: <strong>{questions[0]?.difficulty}</strong>
              </Text>
            </Flex>
          </Details>
          <QuestionItem
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            question={questions[currentQuestion]}
            length={questions.length}
          />
        </MenuWrapper>
      )}
    </Box>
  );
};
