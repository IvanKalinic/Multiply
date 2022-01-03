import { BoardItem } from "../BoardItem";
import styled from "styled-components";

const multiplyArray = [
  12, 14, 15, 16, 18, 20, 21, 24, 25, 27, 28, 30, 32, 34, 35, 36, 40, 42, 45,
  48, 49, 50, 54, 56, 60, 63, 64, 70, 72, 80, 81, 90, 100,
];

export const GameBoard = () => {
  //   const [boardArray, setBoardArray] = useState<Array<number>>([]);
  const GameBoardWrapper = styled.div`
    margin-top: 8px;
    height: 500px;
    width: 500px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    gap: 2px;
  `;
  const boardArray: Array<number> = [];

  const findOccurrences = (value: number) => {
    let counter = 0;
    boardArray.forEach((item) => {
      if (item === value) {
        counter++;
      }
    });
    return counter < 2 ? true : false;
  };

  for (let i = 0; i < 64; i++) {
    if (
      findOccurrences(
        multiplyArray[Math.floor(Math.random() * multiplyArray.length)]
      )
    ) {
      boardArray.push(
        multiplyArray[Math.floor(Math.random() * multiplyArray.length)]
      );
    } else {
      i--;
    }
  }

  console.log(boardArray);

  return (
    <GameBoardWrapper>
      {boardArray.map((item, index) => (
        <BoardItem value={item} key={index} id={index} />
      ))}
    </GameBoardWrapper>
  );
};
