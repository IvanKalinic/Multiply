import { useCallback, useState } from "react";
import { NumberWrapper } from "../../styles";
import {
  vertical,
  horizontal,
  diagonalUp,
  diagonalDown,
} from "../../../../utils";
import { useGame } from "../../../../context/GameContext";
import { MAX_PLAYER_CHOICES } from "../../../../consts";
import { useTurnBased } from "../../../../context/TurnBasedContext";
import { useUser } from "../../../../context/UserContext";
import { useOpponents } from "../../../../context/OpponentsContext";
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

  const { setGame, myTurn } = useTurnBased();
  const { user } = useUser();

  const gameOver = useCallback(() => {
    //vertical
    if (vertical(boardArray)) return true;

    //horizontal
    if (horizontal(boardArray)) return true;

    //diagonal up to the right
    if (diagonalUp(boardArray)) return true;

    //diagonal down to the right
    if (diagonalDown(boardArray)) return true;
  }, [boardArray]);

  const handleChange = () => {
    if (selectedNumber) {
      !color
        ? setMaxClicks((prev) => prev + 1)
        : setMaxClicks((prev) => prev - 1);

      boardArray[index][id].clicked = !color;
      console.log(user?.color);
      boardArray[index][id].color = user?.color ? user?.color : undefined;
      setColor(!color);
      if (maxClicks !== MAX_PLAYER_CHOICES) setSelectedNumber(0);
      if (gameOver()) setDisplayWin(true);
      //save board array to global context - useGame
      //determine color for each player
      setGame(boardArray);
    }
  };

  return (
    <NumberWrapper
      color={!!boardArray[index][id].color && boardArray[index][id].color}
      onClick={handleChange}
      style={{
        backgroundColor: `${
          selectedNumber === value && !boardArray[index][id].clicked
            ? "#9ba4a8"
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
