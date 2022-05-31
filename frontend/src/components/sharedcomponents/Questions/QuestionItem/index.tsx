import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { SetStateAction, useEffect, useState } from "react";
import ArrowRight from "../../../../assets/icons/arrow-right.png";
import { useGame } from "../../../../context/GameContext";
import { useSocket } from "../../../../context/SocketContext";
import { useTurnBased } from "../../../../context/TurnBasedContext";
import { handleShuffle } from "../../../../utils";
import Warning from "../../../Warning";
import OptionButton from "../OptionButton";
import { ArrowWrapper } from "./styles";
interface Props {
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<SetStateAction<number>>;
  question: any;
  length: number;
}

type WarningType = {
  question: boolean;
  item: boolean;
};

const QuestionItem = ({
  currentQuestion,
  setCurrentQuestion,
  question,
  length,
}: Props) => {
  const [options, setOptions] = useState<Array<number>>([]);
  // const [selectedOption, setSelectedOption] = useState<number>(0);
  const [warning, setWarning] = useState<WarningType>({
    question: false,
    item: false,
  });

  const {
    setSelectedNumber,
    selectedNumber,
    maxClicks,
    absentItem,
    selectedOption,
    setSelectedOption,
  } = useGame();
  const { socket } = useSocket();
  const {
    myTurn,
    setMyTurn,
    turnNumber,
    setTurnNumber,
    playerType,
    setPlayer,
    room,
    game,
  } = useTurnBased();

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
    let randomValue = Math.round(Math.random() * length);
    if (absentItem) {
      setCurrentQuestion(randomValue);
      setMyTurn((myTurn) => !myTurn);
      setTurnNumber((turnNumber) => turnNumber + 1);
      setPlayer(playerType);
      socket.emit("reqTurn", {
        value: playerType,
        room,
        game,
        question: randomValue,
      });
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
    setCurrentQuestion(randomValue);
    setMyTurn((myTurn) => !myTurn);
    setTurnNumber((turnNumber) => turnNumber + 1);
    setPlayer(playerType);
    socket.emit("reqTurn", {
      value: playerType,
      room,
      game,
      question: randomValue,
    });
  };

  return (
    <Box>
      <Heading mb="10" mt="20" fontSize="1.5rem">
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
      <Flex flexDirection="row-reverse">
        <ArrowWrapper src={ArrowRight} alt="arrow" onClick={handleNext} />
        {warning.question && <Warning text="You must select an option" />}
        {warning.item && (
          <Warning text="Select one of game board colored items" />
        )}
      </Flex>
    </Box>
  );
};

export default QuestionItem;
