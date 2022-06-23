import { Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  deleteSpecificGame,
  fetchActiveGameBattleArray,
  fetchQuestions,
  getActiveGame,
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
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
}

export const getSign = (category: string) => {
  switch (category) {
    case "Addition":
      return "+";
    case "Substraction":
      return "-";
    case "Multiplication":
      return "x";
    case "Division":
      return ":";
  }
};

const MemoryGame = ({ battle, setRerenderGame, setGameType }: Props) => {
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

      getActiveGame().then((data) => {
        let userGame = data.data.find(
          (item: any) => item.user === user.data.username
        );

        setRandomDifficulty(userGame?.difficulty);
        setRandomCategory(userGame?.category);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!randomCategory && !randomDifficulty) return;

    if (randomDifficulty === "Customize") {
      getActiveGame().then((data) => {
        let userGame = data.data.find(
          (item: any) => item.user === user.data.username
        );
        setQuestions(userGame?.questions);
      });
      return;
    }

    fetchQuestions(randomCategory, randomDifficulty).then((data) =>
      setQuestions(data.data)
    );
  }, [randomDifficulty, randomCategory]);

  let indexesArray: Array<any> = [];

  useEffect(() => {
    if (!questions.length) return;

    if (randomDifficulty === "Customize") {
      indexesArray = [0, 1, 2, 3, 4, 5, 6, 7];
      return;
    }

    for (let i = 0; i < 8; i++) {
      let newValue = 0;
      do {
        newValue = randomIntFromInterval(0, questions.length - 1);
      } while (
        i > 0 &&
        indexesArray.some(
          (value) =>
            value === newValue ||
            questions[value].correctAnswer === questions[newValue].correctAnswer
        )
      );
      // ako je prethodni razlicith od novog ili ako sadrži isti odgovor
      indexesArray[i] = newValue;
    }
  }, [questions]);

  useEffect(() => {
    if (!!!indexesArray.length && !!!questions?.length) return;

    if (!!items.length) return;

    const newArray: Array<any> = [];
    const randomValuesArray: Array<any> = [];

    questions.forEach((item, index) => {
      indexesArray.forEach((indexItem) => {
        if (index === indexItem) {
          newArray.push({
            id: item._id ?? index,
            question: item.question,
            correctAnswer: item.correctAnswer,
          });
        }
      });
    });

    let firstNumber = 0;
    let secondNumber = 0;

    newArray.forEach((item, index) => {
      if (randomCategory === "Addition") {
        firstNumber = randomIntFromInterval(1, item.correctAnswer - 1);
        secondNumber = item.correctAnswer - firstNumber;
      }
      if (randomCategory === "Multiplication") {
        const choices = [
          1,
          item.correctAnswer,
          item.question.trim().replace(/\s/g, "").split("x")[0],
          item.question.trim().replace(/\s/g, "").split("x")[1],
        ];
        let divisors = getDivisors(item.correctAnswer);

        if (!!divisors.length) {
          firstNumber = divisors[randomIntFromInterval(0, divisors.length - 1)];
          secondNumber = item.correctAnswer / firstNumber;
        } else {
          firstNumber = choices[Math.floor(Math.random() * choices.length)];
          secondNumber = item.correctAnswer / firstNumber; // npr. 300 -> [1,300,30,10]
        }
      }
      if (randomCategory === "Substraction") {
        secondNumber = randomIntFromInterval(
          item.question.trim().replace(/\s/g, "").split("-")[1],
          item.question.trim().replace(/\s/g, "").split("-")[0] * 2
        );
        firstNumber = item.correctAnswer + secondNumber;
      }
      if (randomCategory === "Division") {
        secondNumber = randomIntFromInterval(
          2,
          item.question.trim().replace(/\s/g, "").split(":")[1] * 2
        );
        firstNumber = item.correctAnswer * secondNumber;
      }

      randomValuesArray.push({
        id: item.id,
        question: `${firstNumber} ${getSign(randomCategory)} ${secondNumber}`,
        correctAnswer: item.correctAnswer,
      });
    });

    if (!!newArray.length) {
      setItems(
        [...newArray, ...randomValuesArray].sort(() => Math.random() - 0.5)
      );
    }
  }, [questions, indexesArray, randomCategory]);

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

    if (openedCard.length === 2) setTimeout(() => setOpenedCard([]), 400);
  }, [openedCard]);

  useEffect(() => {
    if (win === 8) {
      setTimeout(() => setWinner(true), 500);
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
      {!!winner && (
        <Winner
          setRerenderGame={setRerenderGame}
          memory
          battle={battle}
          setGameType={setGameType}
        />
      )}
      {gameOver && (
        <Winner
          setGameOver={setGameOver}
          gameOver={gameOver}
          memory
          setGameType={setGameType}
          setRerenderGame={setRerenderGame}
        />
      )}
      <CircularBar
        winner={winner}
        workSeconds={200}
        breakSeconds={0}
        setGameOver={setGameOver}
        singleGame={true}
        setTimeSpent={setTimeSpent}
        setWinner={setWinner}
      />
    </Flex>
  );
};

export default MemoryGame;

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getDivisors = (n: number) => {
  const divisors: number[] = [];
  //without 1 or n
  for (let i = 2; i * i <= n; ++i) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i) divisors.push(n / i);
    }
  }
  return divisors;
};