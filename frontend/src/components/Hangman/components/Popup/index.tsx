import React, { useEffect } from "react";
import { checkWin } from "../../helpers";
import { PopupButton, PopupContainer, PopupWrapper } from "../../styles";

interface Props {
  correctLetters: Array<string>;
  wrongLetters: Array<string>;
  selectedWord: string;
  setPlayable: (input: boolean) => void;
  playAgain: () => void;
}

const Popup = ({
  correctLetters,
  wrongLetters,
  selectedWord,
  setPlayable,
  playAgain,
}: Props) => {
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let playable = true;

  if (checkWin(correctLetters, wrongLetters, selectedWord) === "win") {
    finalMessage = "Congratulations! You won! 😃";
    playable = false;
  } else if (checkWin(correctLetters, wrongLetters, selectedWord) === "lose") {
    finalMessage = "Unfortunately you lost. 😕";
    finalMessageRevealWord = `...the word was: ${selectedWord}`;
    playable = false;
  }

  useEffect(() => {
    setPlayable(playable);
  });

  return (
    <PopupContainer style={finalMessage !== "" ? { display: "flex" } : {}}>
      <PopupWrapper>
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>
        <PopupButton onClick={playAgain}>Play Again</PopupButton>
      </PopupWrapper>
    </PopupContainer>
  );
};

export default Popup;
