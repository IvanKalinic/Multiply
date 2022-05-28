import { Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchQuestions,
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
} from "../../../apis";
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

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!!randomCategory && !!randomDifficulty) return;

    setRandomDifficulty(randomValue(difficultyNames));
    setRandomCategory(randomValue(categoryNames));
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

    if (openedCard.length === 2) setTimeout(() => setOpenedCard([]), 1000);
  }, [openedCard]);

  useEffect(() => {
    if (win === 8) {
      setTimeout(() => setWinner(true), 500);
      console.log("Winner");
      if (battle) {
        saveWinnerOrMultiplyDetails({
          type: 5,
          winner: user.data.username,
          battle: { type: 3 },
        });
        navigate("/");
      } else {
        saveWinnerOrMultiplyDetails({
          type: 3,
          winner: user.data.username,
        });
        saveToGameHistory({
          gameName: "Memory game",
          winner: user.data.username,
          points: 3,
          speed: 0,
        });
        saveUserScore(user.data.username, {
          levelNumber: checkLevel(user.data?.overallPoints + 3),
          levelName: levelNameFromScore(user.data?.overallPoints + 3),
          game: {
            type: 3,
            winner: user.data.username,
            points: 3,
          },
        });
        setWin(0);
        setRandomDifficulty("");
        setRandomCategory("");
      }
    }
  }, [win]);

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
      {!!winner && <Winner />}
    </Flex>
  );
};

export default MemoryGame;

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
