import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
} from "../../../../apis";
import { useUser } from "../../../../context/UserContext";
import { checkLevel, levelNameFromScore } from "../../../../utils";
import { checkWin } from "../../helpers";
import { PopupButton, PopupContainer, PopupWrapper } from "../../styles";

interface Props {
  correctLetters: Array<string>;
  wrongLetters: Array<string>;
  selectedWord: string;
  setPlayable: (input: boolean) => void;
  playAgain: () => void;
  battle?: boolean;
}

const Popup = ({
  correctLetters,
  wrongLetters,
  selectedWord,
  setPlayable,
  playAgain,
  battle,
}: Props) => {
  let finalMessage = "";
  let finalMessageRevealWord = "";
  let playable = true;

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkWin(correctLetters, wrongLetters, selectedWord) === "win") {
      finalMessage = "Congratulations! You won! 😃";
      playable = false;
      if (battle) {
        saveWinnerOrMultiplyDetails({
          type: 5,
          winner: user.data.username,
          battle: { type: 4 },
        });
        navigate("/");
      } else {
        saveWinnerOrMultiplyDetails({
          type: 4,
          winner: user.data.username,
        });
        saveToGameHistory({
          gameName: "Hangman",
          winner: user.data.username,
          points: 2,
          speed: 0,
        });
        saveUserScore(user.data.username, {
          levelNumber: checkLevel(user.data?.overallPoints + 2),
          levelName: levelNameFromScore(user.data?.overallPoints + 2),
          game: {
            type: 4,
            winner: user.data.username,
            points: 2,
          },
        });
      }
    } else if (
      checkWin(correctLetters, wrongLetters, selectedWord) === "lose"
    ) {
      finalMessage = "Unfortunately you lost. 😕";
      finalMessageRevealWord = `...the word was: ${selectedWord}`;
      playable = false;
    }
  }, [correctLetters, wrongLetters, selectedWord]);

  useEffect(() => {
    setPlayable(playable);
  });

  return (
    <PopupContainer style={finalMessage !== "" ? { display: "flex" } : {}}>
      <PopupWrapper>
        <h2>{finalMessage}</h2>
        <h3>{finalMessageRevealWord}</h3>
        <PopupButton onClick={playAgain}>
          <Link to="/">Let's play next game in your queue</Link>
        </PopupButton>
      </PopupWrapper>
    </PopupContainer>
  );
};

export default Popup;
