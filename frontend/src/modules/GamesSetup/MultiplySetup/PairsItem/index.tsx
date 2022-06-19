import { Button, Flex, Input } from "@chakra-ui/react";
import React from "react";

interface Props {
  index: number;
  pairs: Array<any>;
  randomGeneratedUsers: Array<any>;
}

const PairsItem = ({ index, pairs, randomGeneratedUsers }: Props) => {
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
        value={pairs[0]}
      />
      <Button>vs</Button>
      <Input
        w="7rem"
        ml="1rem"
        placeholder="2nd op."
        backgroundColor="white"
        value={pairs[1]}
      />
    </Flex>
  );
};

export default PairsItem;
