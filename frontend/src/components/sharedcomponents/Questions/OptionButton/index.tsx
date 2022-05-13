import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useGame } from "../../../../context/GameContext";
import { useTurnBased } from "../../../../context/TurnBasedContext";

interface Props {
  value: number;
  correctAnswer: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  selectedOption: number;
}

const OptionButton = ({
  value,
  correctAnswer,
  setSelectedOption,
  selectedOption,
}: Props) => {
  const { setSelectedNumber } = useGame();
  const { myTurn } = useTurnBased();

  const handleCheck = useCallback(() => {
    setSelectedOption(value);
    if (value === correctAnswer) {
      setSelectedNumber(value);
    }
  }, [value, correctAnswer]);

  const handleColor = useCallback(() => {
    if (selectedOption === value && selectedOption === correctAnswer) {
      return "green";
    }
    if (selectedOption === value && selectedOption !== correctAnswer) {
      return "red";
    }
    if (value === correctAnswer) {
      return "green";
    }
  }, [selectedOption, value, correctAnswer]);

  useEffect(() => {
    handleColor();
  }, [selectedOption, value, handleColor]);

  console.log(myTurn);

  const disabledCase = useMemo(
    () => !!selectedOption || !myTurn,
    [selectedOption, myTurn]
  );

  return (
    <Button
      colorScheme={selectedOption ? handleColor() : "gray"}
      disabled={disabledCase}
      onClick={handleCheck}
      w={200}
      color="black"
      variant="solid"
      mb="2"
      mt="2"
    >
      {value}
    </Button>
  );
};

export default OptionButton;
