import { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useGame } from "../../../../context/GameContext";

import BoardColumn from "../BoardColumn";
import { GameBoardWrapper, Overlay } from "../../styles";
import Winner from "../../../Winner";
import { Flex } from "@chakra-ui/react";

const multiplyArray = [
  12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 34, 35, 36, 40, 42, 45,
  48, 49, 50, 54, 56, 60, 63, 64, 70, 72, 80, 81, 90, 100,
];

const additionArray = [
  14, 21, 27, 29, 43, 57, 58, 48, 55, 38, 36, 50, 44, 31, 39, 46, 60, 72, 62,
  25, 42, 37, 63, 98, 85,
];

export const GameBoard = () => {
  const [boardArray, setBoardArray] = useState<any>([]);
  const [aggArray, setAggArray] = useState<Array<number>>([]);
  const initialArray: any = [];
  const { user } = useUser();
  const { displayWin, setDisplayWin } = useGame();

  const randomValues = () => {
    const randomArray: Array<{ number: number; clicked: boolean }> = [];
    for (let i = 0; i < 8; i++) {
      let randomNumber: number =
        multiplyArray[Math.floor(Math.random() * multiplyArray.length)];
      if (aggArray.filter((item: number) => item === randomNumber).length < 2) {
        randomArray.push({ number: randomNumber, clicked: false });
        setAggArray((aggArray) => [...aggArray, randomNumber]);
      } else {
        i--;
      }
    }
    return randomArray;
  };

  useEffect(() => {
    setDisplayWin(false);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      initialArray.push(randomValues());
    }
    setBoardArray(initialArray);
  }, []);

  return (
    <Flex flexDirection="column">
      {displayWin && <Winner user={user} />}
      <GameBoardWrapper>
        {boardArray.map((column: any, index: number) => (
          <BoardColumn
            column={column}
            key={`col-${index}`}
            id={index}
            boardArray={boardArray}
          />
        ))}
      </GameBoardWrapper>
    </Flex>
  );
};
