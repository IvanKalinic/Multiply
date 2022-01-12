import { Box, Heading, Flex } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import OptionButton from "../OptionButton";
import { handleShuffle } from "../../../../utils";
import { useGame } from "../../../../context/GameContext";

interface Props {
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<SetStateAction<number>>;
  question: any;
}

const QuestionItem = ({
  currentQuestion,
  setCurrentQuestion,
  question,
}: Props) => {
  const [options, setOptions] = useState<Array<number>>([]);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const { setSelectedNumber } = useGame();

  useEffect(() => {
    if (question)
      setOptions(
        handleShuffle([question.correctAnswer, ...question.wrongAnswer])
      );
  }, [currentQuestion, question]);

  //   const handleColor = () => {
  //     if (selectedOption && selectedOption === question.correctAnswer) {
  //       return "green";
  //     }
  //     if (selectedOption  && selectedOption !== question.correctAnswer) {
  //       return "red";
  //     }
  //     if (selectedOption === question.correctAnswer) {
  //       return "green";
  //     }
  //   };

  useEffect(() => {
    setSelectedOption(0);
    setSelectedNumber(0);
  }, [currentQuestion]);

  return (
    <Box>
      <Heading>What is the result of {question?.question} ?</Heading>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="space-around"
        w="100%"
        flex={1}
        flexWrap="wrap"
      >
        <Flex alignItems="center" justifyContent="space-around" flexWrap="wrap">
          {options.map((option, index) => (
            <OptionButton
              key={index}
              value={option}
              //   handleColor={handleColor}
              correctAnswer={question?.correctAnswer}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
            />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default QuestionItem;
