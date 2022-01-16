import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useGame } from "../../../../context/GameContext";
import { MenuWrapper } from "../../../../styles";
import { Details } from "../../styles";
import QuestionItem from "../QuestionItem";

export const QuestionSection = () => {
  const { questions } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  return (
    <Box>
      {questions && (
        <MenuWrapper
          style={{
            marginLeft: "-1.875rem",
            width: "32.5rem",
            height: "26.25rem",
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
