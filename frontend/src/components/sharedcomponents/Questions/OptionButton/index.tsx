import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useGame } from "../../../../context/GameContext";

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

  const handleCheck = () => {
    setSelectedOption(value);
    if (value === correctAnswer) {
      setSelectedNumber(value);
    }
  };

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

  const disabledCase = useMemo(
    () =>
      !!selectedOption && handleColor() !== "red" && handleColor() !== "green",
    [selectedOption, handleColor]
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
