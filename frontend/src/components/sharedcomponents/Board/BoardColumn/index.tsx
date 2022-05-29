import { Flex } from "@chakra-ui/react";
import { BoardItem } from "../BoardItem";

interface Props {
  column: Array<{ number: number; clicked: boolean }>;
  boardArray: any;
  id: number;
  battle?: boolean;
}

const BoardColumn = ({ column, boardArray, id, battle }: Props) => {
  return (
    <Flex flexDirection="column">
      {column?.map((item, index) => (
        <BoardItem
          value={item.number}
          key={index}
          id={index}
          index={id}
          boardArray={boardArray}
          battle={battle}
        />
      ))}
    </Flex>
  );
};

export default BoardColumn;
