import { Button, Flex, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface Props {
  customArray: Array<any>;
  index: number;
  customOperator: string;
  category: string;
}

const CustomizeItem = ({
  customArray,
  index,
  customOperator,
  category,
}: Props) => {
  const [firstOperand, setFirstOperand] = useState(0);
  const [secondOperand, setSecondOperand] = useState(0);

  const handleChange = (e: any, operandNumber: number) => {
    if (operandNumber === 0) setFirstOperand(parseInt(e.target.value));
    if (operandNumber === 1) setSecondOperand(parseInt(e.target.value));
  };

  useEffect(() => {
    if (!!firstOperand && !!secondOperand) {
      customArray[index] = {
        ...customArray[index],
        question: `${firstOperand} ${customOperator} ${secondOperand}`,
        category,
        difficulty: "Customize",
        correctAnswer:
          customOperator === "+"
            ? firstOperand + secondOperand
            : customOperator === "-"
            ? firstOperand - secondOperand
            : customOperator === "x"
            ? firstOperand * secondOperand
            : customOperator === ":"
            ? firstOperand / secondOperand
            : 0,
      };
    }
  }, [firstOperand, secondOperand, index, customArray]);

  return (
    <Flex
      key={index}
      justifyContent="space-evenly"
      alignItems="center"
      mb="0.5rem"
    >
      <Input
        backgroundColor="white"
        w="7rem"
        mr="1rem"
        placeholder="1st op."
        onChange={(e) => handleChange(e, 0)}
      />
      <Button>{customOperator}</Button>
      <Input
        w="7rem"
        ml="1rem"
        placeholder="2nd op."
        backgroundColor="white"
        onChange={(e) => handleChange(e, 1)}
      />
    </Flex>
  );
};

export default CustomizeItem;
