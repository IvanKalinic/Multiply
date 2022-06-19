import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchActiveGameBattleArray,
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
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
}

export const GameBoard = ({
  opponentArray,
  battle,
  battleWinner,
  setGameType,
  setRerenderGame,
}: Props) => {
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

  const { setWinner } = useTurnBased();

  let initialArray: any = [];
  let aggArray: Array<number> = [];

  const randomValues = () => {
    let currentArray: Array<any> = [];

    if (!questions.length) {
      fetchActiveGameBattleArray(user.data.username).then((res) => {
        currentArray = res.data.questions;
      });
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
    if (!!boardArray.length) return;

    fetchActiveGameBattleArray(user.data.username).then((res) => {
      if (!questions?.length && !!res.data?.questions?.length) {
        setQuestions(res.data?.questions);
      }
    });

    for (let i = 0; i < GAMEBOARD_DIMENSION; i++) {
      initialArray[i] = randomValues();
    }

    if (!opponentArray?.length) setBoardArray(initialArray);

    if (!!initialArray[0].length) {
      if (!battle) {
        saveWinnerOrMultiplyDetails({
          type: 1,
          gameBoard: initialArray,
          questions,
          user: user.data.username,
        });
      } else {
        updateBattleArrayInActiveGame(
          1,
          user.data.username,
          initialArray,
          questions,
          false
        );
      }
    }

    setDisplayWin(false);
    if (battle) setMaxClicks(0);

    return () => {
      setQuestions([]);
    };
  }, [user, opponentArray, questions, battle]);

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

  useEffect(() => {
    // if(!battle && !!opponentArray?.length) setBoardArray(opponentArray)
    fetchActiveGameBattleArray(user.data.username).then((res) => {
      if (!!res.data?.gameBoard?.length && !boardArray.length) {
        if (!opponentArray?.length) setBoardArray(res.data.gameBoard);
      }
    });
  }, [user]);

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
    let counter = 0;
    if (!!opponentArray?.length) {
      opponentArray.forEach((item) => {
        if (item.some((value: any) => !!value.color)) counter++;
      });
      if (counter === 0) return;
    }
    if (!!opponentArray?.length) {
      setBoardArray(opponentArray);
    }

    return () => {
      setBoardArray([]);
    };
  }, [opponentArray]);

  useEffect(() => {
    if (!!boardArray.length) {
      updateBattleArrayInActiveGame(
        1,
        user.data.username,
        boardArray,
        questions,
        false
      );
    }
  }, [boardArray]);

  return (
    <>
      <Flex flexDirection="column">
        {displayWin && (
          <Winner
            battleWinner={battleWinner}
            multiply
            battle={battle}
            setGameType={setGameType}
            setRerenderGame={setRerenderGame}
          />
        )}
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
};;;;
