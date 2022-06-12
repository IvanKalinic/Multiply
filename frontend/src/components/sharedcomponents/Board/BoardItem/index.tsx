import { useCallback, useState } from "react";
import {
  fetchActiveGameBattleArray,
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../../../apis";
import { MAX_PLAYER_CHOICES } from "../../../../consts";
import { useGame } from "../../../../context/GameContext";
import { useOpponents } from "../../../../context/OpponentsContext";
import { useSocket } from "../../../../context/SocketContext";
import { useTurnBased } from "../../../../context/TurnBasedContext";
import { useUser } from "../../../../context/UserContext";
import {
  checkBattleArrayWinner,
  checkLevel,
  diagonalDown,
  diagonalUp,
  getGameName,
  horizontal,
  levelNameFromScore,
  vertical,
} from "../../../../utils";
import { NumberWrapper } from "../../styles";
interface Props {
  value: number;
  id: number;
  boardArray: any;
  index: number;
  battle?: boolean;
}

export const BoardItem = ({ value, id, boardArray, index, battle }: Props) => {
  const [color, setColor] = useState<boolean>(false);
  const {
    setDisplayWin,
    selectedNumber,
    maxClicks,
    setMaxClicks,
    setSelectedNumber,
  } = useGame();

  const { playerType, setPlayer, room, game, setGame } = useTurnBased();

  const { opponents } = useOpponents();

  const { user } = useUser();
  const { socket } = useSocket();

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
    if (gameOver()) return;

    if (
      boardArray[index][id].clicked &&
      boardArray[index][id].color !== user.color
    )
      return;

    if (selectedNumber) {
      !color
        ? setMaxClicks((prev) => prev + 1)
        : setMaxClicks((prev) => prev - 1);

      boardArray[index][id].clicked = !color;
      boardArray[index][id].color = user?.color ? user?.color : undefined;
      setColor(!color);
      if (maxClicks !== MAX_PLAYER_CHOICES) setSelectedNumber(0);

      if (gameOver()) {
        setDisplayWin(true);
        socket.emit("reqTurn", {
          value: playerType,
          room,
          game,
          winner: user?.data.username,
        });
        setPlayer(user?.data.username);

        if (!battle) {
          saveWinnerOrMultiplyDetails({
            room,
            type: 1,
            winner: user.data.username,
          });
          saveToGameHistory({
            opponents,
            room,
            gameName: "Multiply",
            winner: user.data.username,
            points: 4,
            speed: 0,
          });
          saveUserScore(user.data.username, {
            levelNumber: checkLevel(user.data?.overallPoints + 4),
            levelName: levelNameFromScore(user.data?.overallPoints + 4),
            game,
          });
        } else {
          fetchActiveGameBattleArray(user.data.username).then((res) => {
            saveUserScore(user.data.username, {
              levelNumber: checkLevel(
                user.data?.overallPoints +
                  checkBattleArrayWinner(
                    res.data.battleArray,
                    user.data.username,
                    user
                  )
                  ? 10
                  : 0
              ),
              levelName: levelNameFromScore(
                user.data?.overallPoints +
                  checkBattleArrayWinner(
                    res.data.battleArray,
                    user.data.username,
                    user
                  )
                  ? 10
                  : 0
              ),
              game,
              battle,
              battleWinner: checkBattleArrayWinner(
                res.data.battleArray,
                user.data.username,
                user
              )
                ? user.data.username
                : null,
            });
          });
        }
      }
      setGame(boardArray);
    }
  };

  return (
    <NumberWrapper
      color={
        !!boardArray[index][id]?.color &&
        boardArray[index][id]?.clicked &&
        boardArray[index][id]?.color
      }
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
