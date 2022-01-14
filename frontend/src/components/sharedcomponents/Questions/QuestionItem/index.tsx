import { Box, Heading, Flex } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import OptionButton from "../OptionButton";
import { handleShuffle } from "../../../../utils";
import { useGame } from "../../../../context/GameContext";
import ArrowRight from "../../../../assets/icons/arrow-right.png";
import Warning from "../../../Warning";
import { ArrowWrapper } from "./styles";

interface Props {
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<SetStateAction<number>>;
  question: any;
}

type WarningType = {
  question: boolean;
  item: boolean;
};

const QuestionItem = ({
  currentQuestion,
  setCurrentQuestion,
  question,
}: Props) => {
  const [options, setOptions] = useState<Array<number>>([]);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [warning, setWarning] = useState<WarningType>({
    question: false,
    item: false,
  });

  const { setSelectedNumber, selectedNumber, maxClicks, absentItem } =
    useGame();

  useEffect(() => {
    if (question)
      setOptions(
        handleShuffle([question.correctAnswer, ...question.wrongAnswer])
      );
  }, [currentQuestion, question]);

  useEffect(() => {
    setSelectedOption(0);
    setSelectedNumber(0);
    setWarning({ question: false, item: false });
  }, [currentQuestion]);

  useEffect(() => {
    if (selectedOption)
      setWarning((prevValue) => ({ ...prevValue, question: false }));
  }, [selectedOption]);

  const handleNext = () => {
    if (absentItem) {
      setCurrentQuestion((curr) => curr + 1);
      return;
    }
    if (selectedNumber && maxClicks < 4) {
      setWarning((prevValue) => ({ ...prevValue, item: true }));
      return;
    }
    if (!selectedOption) {
      setWarning((prevValue) => ({ ...prevValue, question: true }));
      return;
    }
    setCurrentQuestion((curr) => curr + 1);
  };

  return (
    <Box>
      <Heading mb="10" mt="20">
        What is the result of {question?.question} ?
      </Heading>
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
              correctAnswer={question?.correctAnswer}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
            />
          ))}
        </Flex>
      </Flex>
      <ArrowWrapper src={ArrowRight} alt="arrow" onClick={handleNext} />
      {warning.question && <Warning text="You must select an option" />}
      {warning.item && (
        <Warning text="Select one of game board colored items" />
      )}
    </Box>
  );
};

export default QuestionItem;
