import React from "react";
import { WordWrapper, LetterWrapper } from "../../styles";
import { v4 as uuidv4 } from "uuid";
interface Props {
  selectedWord: string;
  correctLetters: Array<string>;
}

const Word = ({ selectedWord, correctLetters }: Props) => {
  let wordToSplit = selectedWord;

  return (
    <WordWrapper>
      {wordToSplit.split("").map((letter, i) => {
        return (
          <LetterWrapper key={uuidv4()}>
            {correctLetters.includes(letter) ? letter : ""}
          </LetterWrapper>
        );
      })}
    </WordWrapper>
  );
};

export default Word;
