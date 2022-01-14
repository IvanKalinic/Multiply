import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useGame } from "../../context/GameContext";
import { PawnWrapper } from "../components.style";

const Pawns = () => {
  const { maxClicks } = useGame();
  let pawnsArray: Array<any> = [1, 2, 3, 4];

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ position: "absolute", right: "3.5rem" }}
    >
      {maxClicks !== 4 && (
        <Text fontSize="2xl" mb="2" mr="-4" color="white">
          Available:
        </Text>
      )}
      {pawnsArray.map((item) => item > maxClicks && <PawnWrapper />)}
    </Flex>
  );
};

export default Pawns;
