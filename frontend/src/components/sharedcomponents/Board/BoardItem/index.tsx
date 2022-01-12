import { useState } from "react";
import { NumberWrapper } from "../../styles";
import {
  vertical,
  horizontal,
  diagonalUp,
  diagonalDown,
} from "../../../../utils";
import { useGame } from "../../../../context/GameContext";

export const BoardItem = ({
  value,
  id,
  boardArray,
  index,
}: {
  value: number;
  id: number;
  boardArray: any;
  index: number;
}) => {
  const [color, setColor] = useState<boolean>(false);
  const { setDisplayWin } = useGame();

  const gameOver = () => {
    //vertical
    if (vertical(boardArray)) return true;

    //horizontal
    if (horizontal(boardArray)) return true;

    //diagonal up to the right
    if (diagonalUp(boardArray)) return true;

    //diagonal down to the right
    if (diagonalDown(boardArray)) return true;
  };

  const handleChange = () => {
    boardArray[index][id].clicked = !color;
    setColor(!color);
    if (gameOver()) {
      setDisplayWin(true);
    }
  };

  console.log(boardArray[index][id].clicked);
  console.log("Game over " + gameOver());
  return (
    <NumberWrapper color={color} onClick={handleChange}>
      {value}
    </NumberWrapper>
  );
};
