import { useState } from "react";
import { NumberWrapper } from "../../styles";
import {
  vertical,
  horizontal,
  diagonalUp,
  diagonalDown,
} from "../../../../utils";
import { useGame } from "../../../../context/GameContext";

const MAX_PLAYER_CHOICES = 4;

interface Props {
  value: number;
  id: number;
  boardArray: any;
  index: number;
}

export const BoardItem = ({ value, id, boardArray, index }: Props) => {
  const [color, setColor] = useState<boolean>(false);
  const {
    setDisplayWin,
    selectedNumber,
    maxClicks,
    setMaxClicks,
    setSelectedNumber,
  } = useGame();

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
    if (selectedNumber) {
      !color
        ? setMaxClicks((prev) => prev + 1)
        : setMaxClicks((prev) => prev - 1);

      boardArray[index][id].clicked = !color;
      setColor(!color);
      if (maxClicks !== MAX_PLAYER_CHOICES) setSelectedNumber(0);
      if (gameOver()) setDisplayWin(true);
    }
  };

  return (
    <NumberWrapper
      color={color}
      onClick={handleChange}
      style={{
        backgroundColor: `${
          selectedNumber === value && !boardArray[index][id].clicked
            ? "gray"
            : ""
        }`,
        pointerEvents: `${
          maxClicks === MAX_PLAYER_CHOICES &&
          !boardArray[index][id].clicked &&
          !color
            ? "none"
            : (maxClicks < MAX_PLAYER_CHOICES &&
                value !== selectedNumber &&
                !boardArray[index][id].clicked &&
                !color) ||
              (maxClicks < MAX_PLAYER_CHOICES && color)
            ? "none"
            : "auto"
        }`,
      }}
    >
      {value}
    </NumberWrapper>
  );
};
