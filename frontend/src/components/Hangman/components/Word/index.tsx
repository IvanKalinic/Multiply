import React from "react";
import { WordWrapper, LetterWrapper } from "../../styles";

interface Props {
  selectedWord: string;
  correctLetters: Array<string>;
}

const Word = ({ selectedWord, correctLetters }: Props) => {
  return (
    <WordWrapper>
      {selectedWord.split("").map((letter, i) => {
        return (
          <LetterWrapper key={i}>
            {correctLetters.includes(letter) ? letter : ""}
          </LetterWrapper>
        );
      })}
    </WordWrapper>
  );
};

export default Word;
