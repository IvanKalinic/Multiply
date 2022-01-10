import { Flex } from "@chakra-ui/react";
import { BoardItem } from "../BoardItem";

const BoardColumn = ({
  column,
  boardArray,
  id,
}: {
  column: Array<{ number: number; clicked: boolean }>;
  boardArray: any;
  id: number;
}) => {
  return (
    <Flex flexDirection="column">
      {column.map((item, index) => (
        <BoardItem
          value={item.number}
          key={index}
          id={index}
          index={id}
          boardArray={boardArray}
        />
      ))}
    </Flex>
  );
};

export default BoardColumn;
