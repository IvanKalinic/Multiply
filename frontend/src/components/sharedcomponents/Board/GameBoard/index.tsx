import { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useGame } from "../../../../context/GameContext";
import BoardColumn from "../BoardColumn";
import { GameBoardWrapper } from "../../styles";
import Winner from "../../../Winner";
import { Flex } from "@chakra-ui/react";
import {
  multiplyArray as currentArray,
  additionArray,
  substractionArray,
  divisionArray,
} from "../../../../consts/gameCategory";

export const GameBoard = () => {
  const [boardArray, setBoardArray] = useState<any>([]);
  const { user } = useUser();
  const { questions, displayWin, setDisplayWin } = useGame();
  const initialArray: any = [];
  let aggArray: Array<number> = [];

  const chooseCategory = () => {
    switch (questions[0]?.category) {
      case "Addition":
        return additionArray;
      case "Substraction":
        return substractionArray;
      case "Multiplication":
        return currentArray;
      case "Division":
        return divisionArray;
      default:
        return [];
    }
  };

  const randomValues = () => {
    const currentArray = chooseCategory();
    const randomArray: Array<{ number: number; clicked: boolean }> = [];
    for (let i = 0; i < 8; i++) {
      let randomNumber: number =
        currentArray[Math.floor(Math.random() * currentArray.length)];
      if (aggArray.filter((item: number) => item === randomNumber).length < 3) {
        randomArray.push({ number: randomNumber, clicked: false });
        aggArray.push(randomNumber);
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

  console.log(aggArray.filter((item: number) => item === 100).length);
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
