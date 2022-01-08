import React from "react";
import { Flex } from "@chakra-ui/react";
import { BoardItem } from "../BoardItem";

const BoardColumn = ({ column }: { column: Array<number> }) => {
  return (
    <Flex flexDirection="column">
      {column.map((item, index) => (
        <BoardItem value={item} key={index} id={index} />
      ))}
    </Flex>
  );
};

export default BoardColumn;
