import { Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  deleteSpecificGame,
  fetchActiveGameBattleArray,
  fetchQuestions,
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../../apis";
import { CircularBar } from "../../../components/CircularProgressbar";
import Winner from "../../../components/Winner";
import { categories, difficulties } from "../../../consts";
import { useUser } from "../../../context/UserContext";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { checkLevel, levelNameFromScore, randomValue } from "../../../utils";
import { MemoryCardsContainer } from "../../modules.style";
import CardItem from "./CardItem";

const difficultyNames = difficulties.map((diff) => diff.category);
const categoryNames = categories.map((diff) => diff.category);

interface Props {
  battle?: boolean;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
}

const MemoryGame = ({ battle, setRerenderGame }: Props) => {
  const [items, setItems] = useState<Array<any>>([]);
  const [questions, setQuestions] = useState<Array<any>>([]);
  const [randomDifficulty, setRandomDifficulty] = useLocalStorage(
    "randDiff",
    ""
  );
  const [randomCategory, setRandomCategory] = useLocalStorage("randCat", "");

  const [openedCard, setOpenedCard] = useState<Array<any>>([]);
  const [matched, setMatched] = useState<Array<any>>([]);
  const [win, setWin] = useState<number>(0);
  const [winner, setWinner] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  const { user } = useUser();

  useEffect(() => {
    if (battle) {
      fetchActiveGameBattleArray(user.data.username).then((res) => {
        setRandomCategory(res?.data?.category);
        setRandomDifficulty(res?.data?.difficulty);
      });
    } else {
      if (!!randomCategory && !!randomDifficulty) return;

      setRandomDifficulty(randomValue(difficultyNames));
      setRandomCategory(randomValue(categoryNames));
    }
  }, [user]);

  useEffect(() => {
    if (!randomCategory && !randomDifficulty) return;

    fetchQuestions(randomCategory, randomDifficulty).then((data) =>
      setQuestions(data.data)
    );
  }, [randomDifficulty, randomCategory]);

  let indexesArray: Array<any> = [];

  useEffect(() => {
    if (!questions.length) return;

    for (let i = 0; i < 8; i++) {
      let newValue = 0;
      do {
        newValue = randomIntFromInterval(0, questions.length - 1);
      } while (i > 0 && indexesArray.some((value) => value === newValue));
      // ako je prethodni razlicith od novog
      indexesArray[i] = newValue;
    }
  }, [questions]);
  console.log(indexesArray);
  useEffect(() => {
    if (!!!indexesArray.length && !!!questions.length) return;

    if (!!items.length) return;

    const newArray: Array<any> = [];

    questions.forEach((item, index) => {
      indexesArray.forEach((indexItem) => {
        if (index === indexItem) {
          newArray.push({
            id: item._id,
            question: item.question,
            correctAnswer: item.correctAnswer,
          });
        }
      });
    });

    if (!!newArray.length) {
      setItems([...newArray, ...newArray].sort(() => Math.random() - 0.5));
    }
  }, [questions, indexesArray]);

  const flipCard = (index: number) => {
    setOpenedCard((opened) => [...opened, index]);
  };

  useEffect(() => {
    if (openedCard.length < 2) return;

    const firstMatched = items[openedCard[0]];
    const secondMatched = items[openedCard[1]];

    if (secondMatched && firstMatched.id === secondMatched.id) {
      setWin((win) => win + 1);
      setMatched([...matched, firstMatched.id]);
    }

    if (openedCard.length === 2) setTimeout(() => setOpenedCard([]), 500);
  }, [openedCard]);

  console.log(timeSpent);

  useEffect(() => {
    if (win === 8) {
      setTimeout(() => setWinner(true), 500);
      console.log("Winner");
      if (battle) {
        updateBattleArrayInActiveGame(3, user.data.username);
      } else {
        saveWinnerOrMultiplyDetails({
          type: 3,
          winner: user.data.username,
        });
        saveToGameHistory({
          gameName: "Memory game",
          winner: user.data.username,
          points: 3,
          speed: timeSpent,
        });
        saveUserScore(user.data.username, {
          levelNumber: checkLevel(user.data?.overallPoints + 2),
          levelName: levelNameFromScore(user.data?.overallPoints + 2),
          speed: timeSpent,
          game: {
            type: 3,
            winner: user.data?.username,
            points: 2,
          },
        });
        setWin(0);
        setRandomDifficulty("");
        setRandomCategory("");
      }
    }
  }, [win]);

  useEffect(() => {
    if (battle) {
      updateBattleArrayInActiveGame(3, user.data.username, {}, {}, false);
      return;
    }
    if (gameOver) {
      deleteSpecificGame(user.data.username);
      saveUserScore(user.data.username, { game: {} });
    }
  }, [gameOver]);

  console.log(win);
  console.log(items);

  return (
    <Flex flexDirection="column" justifyContent="center">
      <Heading fontSize="lg" mt="1rem" mb="2rem">
        Memory Game
      </Heading>
      <MemoryCardsContainer>
        {items?.map((item, index) => {
          let isFlipped = false;
          if (openedCard.includes(index)) isFlipped = true;
          if (matched.includes(item.id)) isFlipped = true;
          return (
            <CardItem
              key={index}
              item={item}
              id={index}
              isFlipped={isFlipped}
              flipCard={flipCard}
            />
          );
        })}
      </MemoryCardsContainer>
      {!!winner && <Winner setRerenderGame={setRerenderGame} />}
      {gameOver && <Winner setGameOver={setGameOver} gameOver={gameOver} />}
      <CircularBar
        winner={winner}
        workSeconds={60}
        breakSeconds={0}
        setGameOver={setGameOver}
        singleGame={true}
        setTimeSpent={setTimeSpent}
      />
    </Flex>
  );
};

export default MemoryGame;

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
