import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  deleteSpecificGame,
  getActiveGame,
  saveUserScore,
  updateBattleArrayInActiveGame,
} from "../../apis";
import { useUser } from "../../context/UserContext";
import { CircularBar } from "../CircularProgressbar";
import Winner from "../Winner";
import { Figure, Popup, Word, WrongLetters, Notification } from "./components";
import { palatalsCode, show, words } from "./helpers";
import { BodyWrapper, GameContainer } from "./styles";
interface Props {
  battle?: boolean;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
}

const Hangman = ({ battle, setRerenderGame, setGameType }: Props) => {
  const [playable, setPlayable] = useState<boolean>(true);
  const [correctLetters, setCorrectLetters] = useState<Array<string>>([]);
  const [wrongLetters, setWrongLetters] = useState<Array<any>>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [newWord, setNewWord] = useState("");

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getActiveGame().then((data) => {
        let userGame = data.data.find(
          (item: any) => item.user === user.data.username
        );
        setNewWord(
          userGame?.newWord ?? words[Math.floor(Math.random() * words.length)]
        );
      });
    }
  }, [user]);

  useEffect(() => {
    const handleKeydown = (e: any) => {
      const { key, keyCode } = e;
      if (
        (playable && keyCode >= 65 && keyCode <= 90) ||
        palatalsCode.includes(keyCode)
      ) {
        const letter = key.toLowerCase();
        if (newWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [correctLetters, wrongLetters, playable, newWord]);

  const playAgain = () => {
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    //random word again
    setNewWord(words[Math.floor(Math.random() * words.length)]);
  };

  useEffect(() => {
    if (battle) {
      updateBattleArrayInActiveGame(4, user.data.username, {}, {}, false);
      return;
    }
    if (gameOver) {
      deleteSpecificGame(user.data.username);
      saveUserScore(user.data.username, { game: {} });
    }
  }, [gameOver]);

  return (
    <BodyWrapper>
      <Heading mt="10rem" mb="-5rem">
        Enter the letter from your keyboard
      </Heading>
      <GameContainer>
        <Figure wrongLetters={wrongLetters} />
        <WrongLetters wrongLetters={wrongLetters} />
        <Word selectedWord={newWord} correctLetters={correctLetters} />
      </GameContainer>
      <Popup
        correctLetters={correctLetters}
        wrongLetters={wrongLetters}
        selectedWord={newWord}
        setPlayable={setPlayable}
        playAgain={playAgain}
        battle={battle}
        setRerenderGame={setRerenderGame}
        setWinner={setWinner}
        timeSpent={timeSpent}
      />
      {gameOver && (
        <Winner
          setGameOver={setGameOver}
          gameOver={gameOver}
          hangman
          battle={battle}
          setGameType={setGameType}
          setRerenderGame={setRerenderGame}
        />
      )}
      <CircularBar
        winner={winner}
        workSeconds={60}
        breakSeconds={0}
        setGameOver={setGameOver}
        singleGame={true}
        setTimeSpent={setTimeSpent}
        setWinner={setWinner}
      />
      {showNotification && <Notification />}
    </BodyWrapper>
  );
};;;

export default Hangman;
