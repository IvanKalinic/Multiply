import { Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { fetchQuestions } from "../../../apis";
import { categories, difficulties } from "../../../consts";
import { randomValue } from "../../../utils";
import { MemoryCardsContainer } from "../../modules.style";
import CardItem from "./CardItem";

const difficultyNames = difficulties.map((diff) => diff.category);
const categoryNames = categories.map((diff) => diff.category);

const MemoryGame = () => {
  const [items, setItems] = useState<Array<any>>([]);
  const [questions, setQuestions] = useState<Array<any>>([]);
  const [randomDifficulty, setRandomDifficulty] = useState<string>("");
  const [randomCategory, setRandomCategory] = useState<string>("");

  const [openedCard, setOpenedCard] = useState<Array<any>>([]);
  const [matched, setMatched] = useState<Array<any>>([]);
  const [win, setWin] = useState<number>(0);

  useEffect(() => {
    setRandomDifficulty(randomValue(difficultyNames));
    setRandomCategory(randomValue(categoryNames));
  }, []);

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
      } while (i > 1 && indexesArray.find((value) => value === newValue));
      // ako je prethodni razlicith od novog
      indexesArray[i] = newValue;
    }
  }, [questions]);

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

  if (win === 8) console.log("Winner");

  return (
    <Flex>
      <Heading fontSize="md">MemoryGame</Heading>
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
    </Flex>
  );
};

export default MemoryGame;

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
