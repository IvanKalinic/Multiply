import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../../../apis";
import { useUser } from "../../../../context/UserContext";
import { checkLevel, levelNameFromScore } from "../../../../utils";
import Winner from "../../../Winner";
import { checkWin } from "../../helpers";
import { PopupButton, PopupContainer, PopupWrapper } from "../../styles";

interface Props {
  correctLetters: Array<string>;
  wrongLetters: Array<string>;
  selectedWord: string;
  setPlayable: (input: boolean) => void;
  playAgain: () => void;
  battle?: boolean;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  setWinner?: React.Dispatch<React.SetStateAction<boolean>>;
  timeSpent?: number;
}

const Popup = ({
  correctLetters,
  wrongLetters,
  selectedWord,
  setPlayable,
  playAgain,
  battle,
  setRerenderGame,
  setWinner,
  timeSpent,
}: Props) => {
  let playable = true;

  const [finalMessageRevealWord, setFinalMessageRevealWord] = useState("");
  const [finalMessage, setFinalMessage] = useState("");
  const { user } = useUser();

  // const handleNext = () => {
  //   if (battle) {
  //     updateBattleArrayInActiveGame(4, user.data.username);
  //     setRerenderGame!(1);
  //   }
  // };

  useEffect(() => {
    if (checkWin(correctLetters, wrongLetters, selectedWord) === "win") {
      // finalMessage = "Congratulations! You won! 😃";
      setFinalMessage("Congratulations! You won! 😃");
      playable = false;

      setWinner!(true);

      if (!battle) {
        saveWinnerOrMultiplyDetails({
          type: 4,
          winner: user.data.username,
        });
        saveToGameHistory({
          gameName: "Hangman",
          winner: user.data.username,
          points: 2,
          speed: timeSpent,
        });
        saveUserScore(user.data.username, {
          levelNumber: checkLevel(user.data?.overallPoints + 3),
          levelName: levelNameFromScore(user.data?.overallPoints + 3),
          speed: timeSpent,
          game: {
            type: 4,
            winner: user.data.username,
            points: 3,
          },
        });
      }
    } else if (
      checkWin(correctLetters, wrongLetters, selectedWord) === "lose"
    ) {
      setFinalMessage("Unfortunately you lost. 😕");
      setFinalMessageRevealWord(`...the word was: ${selectedWord}`);
      playable = false;
    }
  }, [correctLetters, wrongLetters, selectedWord]);

  useEffect(() => {
    setPlayable(playable);
  });

  useEffect(() => {
    if (!correctLetters.length) {
      setFinalMessage("");
      setFinalMessageRevealWord("");
    }
  }, [correctLetters]);

  console.log(finalMessage);
  console.log(checkWin(correctLetters, wrongLetters, selectedWord) === "win");

  // if (!!finalMessage) updateBattleArrayInActiveGame(4, user.data.username);

  return (
    <div>
      {!!finalMessage && (
        <Winner
          setRerenderGame={setRerenderGame}
          finalMessage={finalMessage}
          finalMessageRevealWord={finalMessageRevealWord}
          user={user}
          playAgain={playAgain}
        />
      )}
    </div>
  );
};;

export default Popup;
