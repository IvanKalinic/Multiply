import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchActiveGameBattleArray,
  getActiveGame,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../../../apis";
import { GAMEBOARD_DIMENSION, MAX_PLAYER_CHOICES } from "../../../../consts";
import { useGame } from "../../../../context/GameContext";
import { useTurnBased } from "../../../../context/TurnBasedContext";
import { useUser } from "../../../../context/UserContext";
import BadLuck from "../../../BadLuck";
import Winner from "../../../Winner";
import { GameBoardWrapper } from "../../styles";
import BoardColumn from "../BoardColumn";
interface Props {
  opponentArray?: Array<any>;
  battle?: boolean;
  battleWinner?: string;
}

export const GameBoard = ({ opponentArray, battle, battleWinner }: Props) => {
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

  const { winner, setWinner, player } = useTurnBased();

  let initialArray: any = [];
  let aggArray: Array<number> = [];

  const randomValues = () => {
    let currentArray: Array<any> = [];

    if (!questions.length) {
      if (battle) {
        fetchActiveGameBattleArray(user.data.username).then((res) => {
          currentArray = res.data.questions;
        });
      } else {
        getActiveGame().then((data) => {
          currentArray = data?.data[0]?.questions;
        });
      }
    } else {
      currentArray = [...questions];
    }

    let randomArray: Array<any> = [];
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
    if (!!opponentArray?.length) {
      updateBattleArrayInActiveGame(
        1,
        user.data.username,
        boardArray,
        questions,
        false
      );
      return;
    }

    if (battle) {
      fetchActiveGameBattleArray(user.data.username).then((res) => {
        if (!questions.length && !!res.data?.questions.length) {
          setQuestions(res.data?.questions);
        }
      });
    } else {
      getActiveGame().then((data) => {
        setQuestions(data.data[0]?.questions);
      });
    }

    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      initialArray[i] = randomValues();
      console.log(initialArray[i]);
    }

    setBoardArray(initialArray);

    if (!!initialArray[0].length) {
      // if (battle) {
      //   updateBattleArrayInActiveGame(
      //     1,
      //     user.data.username,
      //     initialArray,
      //     questions,
      //     false
      //   );
      // }
      // else {
      if (!battle) {
        saveWinnerOrMultiplyDetails({
          type: 1,
          gameBoard: initialArray,
          questions,
          user: user.data.username,
        });
      }
      // }
    } else {
      if (battle) {
        fetchActiveGameBattleArray(user.data.username).then((res) => {
          if (!!res.data?.gameBoard.length && !boardArray.length)
            setBoardArray(res.data?.gameBoard);
        });
      } else {
        getActiveGame().then((data) => {
          setBoardArray(data.data[0]?.gameBoard);
        });
      }
    }

    setDisplayWin(false);
    setMaxClicks(0);
  }, [user, opponentArray, questions]);

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
        battle={battle}
      />
    ));
  };

  useEffect(() => {
    setBoardArray(opponentArray);
  }, [opponentArray]);

  useEffect(() => {
    console.log(initialArray);
    if (!!boardArray.length)
      updateBattleArrayInActiveGame(
        1,
        user.data.username,
        boardArray,
        questions,
        false
      );
    // if (!!initialArray.length) setBoardArray(initialArray);
  }, [initialArray]);

  return (
    <>
      <Flex flexDirection="column">
        {displayWin && <Winner battleWinner={battleWinner} />}
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
};;
