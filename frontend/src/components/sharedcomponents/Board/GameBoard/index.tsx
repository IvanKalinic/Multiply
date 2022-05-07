import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useGame } from "../../../../context/GameContext";
import BoardColumn from "../BoardColumn";
import { GameBoardWrapper } from "../../styles";
import Winner from "../../../Winner";
import { Flex } from "@chakra-ui/react";
import {
  easyAdditionArray,
  mediumAdditionArray,
  hardAdditionArray,
  substractionArray,
  divisionArray,
  easyMultiplyArray,
  mediumMultiplyArray,
  hardMultiplyArray,
} from "../../../../consts/gameCategory";
import BadLuck from "../../../BadLuck";
import { GAMEBOARD_DIMENSION, MAX_PLAYER_CHOICES } from "../../../../consts";
import { useTurnBased } from "../../../../context/TurnBasedContext";
interface Props {
  opponentArray?: Array<any>;
}

export const GameBoard = ({ opponentArray }: Props) => {
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

  const { winner, setWinner } = useTurnBased();

  const initialArray: any = [];
  let aggArray: Array<number> = [];

  const chooseCategory = useCallback(() => {
    console.log(questions);
    switch (questions[0]?.category) {
      case "Addition":
        if (questions[0]?.difficulty === "Easy") return easyAdditionArray;
        if (questions[0]?.difficulty === "Medium") return mediumAdditionArray;
        if (questions[0]?.difficulty === "Hard") return hardAdditionArray;
        else return easyAdditionArray;
      case "Substraction":
        return substractionArray;
      case "Multiplication":
        if (questions[0]?.difficulty === "Easy") return easyMultiplyArray;
        if (questions[0]?.difficulty === "Medium") return mediumMultiplyArray;
        if (questions[0]?.difficulty === "Hard") return hardMultiplyArray;
        else return easyMultiplyArray;
      case "Division":
        return divisionArray;
      default:
        return [];
    }
  }, [questions]);

  const randomValues = useCallback(() => {
    const currentArray = chooseCategory();
    const randomArray: Array<{ number: number; clicked: boolean }> = [];
    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      console.log("First loop");
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
  }, [chooseCategory, aggArray]);

  console.log(questions);

  useEffect(() => {
    if (opponentArray) return;

    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      console.log("Second loop");
      initialArray[i] = randomValues();
    }
    setBoardArray(initialArray);

    // ode ide save gamea (board,questions)
    // saveWinnerOrMultiplyDetails()

    setDisplayWin(false);
    setMaxClicks(0);
  }, [user, opponentArray]);

  const checkAbsent = useCallback(() => {
    let counter = 0;
    boardArray.forEach((array: any) => {
      console.log("Third loop");
      if (array.filter((item: any) => item.number === selectedNumber).length) {
        counter = counter + 1;
      }
    });
    return counter;
  }, [boardArray, selectedNumber]);

  useEffect(() => {
    if (selectedNumber && !checkAbsent()) {
      setAbsentItem(true);
    }
    if (maxClicks < MAX_PLAYER_CHOICES) {
      setDisplayMessage(false);
    }
  }, [selectedNumber]);

  useEffect(() => {
    if (maxClicks === MAX_PLAYER_CHOICES) {
      setDisplayMessage(true);
    }
  }, [maxClicks]);

  console.log("Board array", boardArray);

  useEffect(() => {
    if (displayWin) {
      setWinner(true);
    }
  }, [displayWin]);

  const renderList = (array: Array<any>) => {
    return array.map((column: any, index: number) => (
      <BoardColumn
        column={column}
        key={`col-${index}`}
        id={index}
        boardArray={boardArray}
      />
    ));
  };

  return (
    <>
      <Flex flexDirection="column">
        {displayWin && <Winner />}
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
          {opponentArray ? renderList(opponentArray) : renderList(boardArray)}
        </GameBoardWrapper>
      </Flex>
    </>
  );
};
