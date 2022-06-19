import { Button, Flex, Input } from "@chakra-ui/react";
import React from "react";

interface Props {
  pairs: Array<any>;
}

const PairsItem = ({ pairs }: Props) => {
  return (
    <Flex alignItems="center" mb="0.5rem">
      <Flex alignItems="center" justifyContent="start" mr="1rem">
        <Input
          backgroundColor="white"
          placeholder="1st op."
          value={pairs[0]?.username ?? ""}
          w="6rem"
          mr="0.1rem"
          readOnly
        />
        <span
          style={{
            position: "relative",
            left: "-2rem",
            fontWeight: "bold",
            marginRight: "-1.5rem",
          }}
        >{`#${pairs[0]?.rank}`}</span>
      </Flex>
      <Button>vs</Button>
      <Flex alignItems="center" justifyContent="start" ml="1rem">
        <Input
          placeholder="2nd op."
          backgroundColor="white"
          value={pairs[1]?.username ?? ""}
          w="6rem"
          mr="0.1rem"
          readOnly
        />
        <span
          style={{
            position: "relative",
            left: "-2rem",
            fontWeight: "bold",
            marginRight: "-1.5rem",
          }}
        >{`#${pairs[1]?.rank}`}</span>
      </Flex>
    </Flex>
  );
};

export default PairsItem;
