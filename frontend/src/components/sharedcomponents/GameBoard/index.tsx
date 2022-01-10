import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import BoardColumn from "../BoardColumn";
import { BoardItem } from "../BoardItem";
import { GameBoardWrapper } from "../styles";

const multiplyArray = [
  12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 34, 35, 36, 40, 42, 45,
  48, 49, 50, 54, 56, 60, 63, 64, 70, 72, 80, 81, 90, 100,
];

export const GameBoard = () => {
  const [boardArray, setBoardArray] = useState<any>([]);
  const [aggArray, setAggArray] = useState<Array<number>>([]);
  const initialArray: any = [];
  const { user } = useUser();

  console.log(user);

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
    for (let i = 0; i < 8; i++) {
      initialArray.push(randomValues());
    }
    setBoardArray(initialArray);
  }, []);

  useEffect(() => console.log(boardArray), [boardArray]);
  // console.log(boardArray);

  // console.log(gameOver());
  console.log(boardArray);
  return (
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
  );
};
