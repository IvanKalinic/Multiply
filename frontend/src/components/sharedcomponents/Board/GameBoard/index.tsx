import { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useGame } from "../../../../context/GameContext";
import BoardColumn from "../BoardColumn";
import { GameBoardWrapper } from "../../styles";
import Winner from "../../../Winner";
import { Flex, Text } from "@chakra-ui/react";
import {
  multiplyArray as currentArray,
  additionArray,
  substractionArray,
  divisionArray,
} from "../../../../consts/gameCategory";
import BadLuck from "../../../BadLuck";
import Warning from "../../../Warning";
import Explanation from "../../../Explanation";

export const GameBoard = () => {
  const [boardArray, setBoardArray] = useState<any>([]);
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);
  const { user } = useUser();
  const {
    questions,
    displayWin,
    setDisplayWin,
    setMaxClicks,
    selectedNumber,
    setAbsentItem,
    absentItem,
    maxClicks,
  } = useGame();
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
  console.log(aggArray);

  useEffect(() => {
    for (let i = 0; i < 8; i++) {
      initialArray.push(randomValues());
    }
    setBoardArray(initialArray);
    setDisplayWin(false);
    setMaxClicks(0);
  }, []);

  const checkAbsent = () => {
    let counter = 0;
    boardArray.forEach((array) => {
      if (array.filter((item) => item.number === selectedNumber).length) {
        counter = counter + 1;
      }
    });
    return counter;
  };

  useEffect(() => {
    if (selectedNumber && !checkAbsent()) {
      setAbsentItem(true);
    }
    if (maxClicks < 4) {
      setDisplayMessage(false);
    }
  }, [selectedNumber]);

  useEffect(() => {
    if (maxClicks === 4) {
      setDisplayMessage(true);
    }
  }, [maxClicks]);

  return (
    <>
      <Flex flexDirection="column">
        {displayWin && <Winner user={user} />}
        {absentItem && (
          <BadLuck text="Sorry, the selected value doesn't exist on the board" />
        )}
        {displayMessage && (
          <BadLuck
            text="You reached maximum of 4 selected items. In order to select new one
          first unclick one of selected items."
          />
        )}
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
    </>
  );
};
