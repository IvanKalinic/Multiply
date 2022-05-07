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
import { getActiveGame, saveWinnerOrMultiplyDetails } from "../../../../apis";
interface Props {
  opponentArray?: Array<any>;
}

export const GameBoard = ({ opponentArray }: Props) => {
  const [boardArray, setBoardArray] = useState<any>([]);
  const [displayMessage, setDisplayMessage] = useState<boolean>(false);

  const { user } = useUser();
  const {
    displayWin,
    setDisplayWin,
    setMaxClicks,
    selectedNumber,
    setAbsentItem,
    absentItem,
    maxClicks,
  } = useGame();

  const [questions, setQuestions] = useState<Array<any>>([]);

  const { winner, setWinner } = useTurnBased();

  const initialArray: any = [];
  let aggArray: Array<number> = [];

  const randomValues = () => {
    let currentArray: Array<any> = [];

    if (!questions.length) {
      getActiveGame().then((data) => {
        currentArray = [...data.data[0]?.questions];
      });
    } else {
      currentArray = [...questions];
    }

    const randomArray: Array<any> = [];
    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      let randomNumber: number = 0;
      if (!!currentArray.length) {
        randomNumber =
          currentArray[Math.floor(Math.random() * currentArray.length)]
            ?.correctAnswer;
        if (
          !!randomNumber &&
          aggArray.filter((item: number) => item === randomNumber).length < 3
        ) {
          randomArray.push({ number: randomNumber, clicked: false });
          aggArray.push(randomNumber);
        } else {
          i--;
        }
      }
    }
    return randomArray;
  };

  useEffect(() => {
    if (!!boardArray[0]?.length || !!opponentArray?.length) return;

    getActiveGame().then((data) => {
      setQuestions(data.data[0]?.questions);
    });

    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      initialArray[i] = randomValues();
    }

    setBoardArray(initialArray);
    if (!!initialArray[0].length) {
      saveWinnerOrMultiplyDetails({ gameBoard: initialArray, questions });
    } else {
      getActiveGame().then((data) => {
        setBoardArray(data.data[0]?.gameBoard);
      });
    }

    setDisplayWin(false);
    setMaxClicks(0);
  }, [user, opponentArray]);

  const checkAbsent = useCallback(() => {
    let counter = 0;
    boardArray.forEach((array: any) => {
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

  useEffect(() => {
    if (displayWin) {
      setWinner(true);
    }
  }, [displayWin]);

  const renderList = (array: Array<any>) => {
    return array?.map((column: any, index: number) => (
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
          {!!opponentArray?.length
            ? renderList(opponentArray)
            : renderList(boardArray)}
        </GameBoardWrapper>
      </Flex>
    </>
  );
};
