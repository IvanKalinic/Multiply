import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Figure, Popup, Word, WrongLetters, Notification } from "./components";
import { palatalsCode, show, words } from "./helpers";
import { BodyWrapper, GameContainer } from "./styles";

let selectedWord = words[Math.floor(Math.random() * words.length)];

const Hangman = () => {
  const [playable, setPlayable] = useState<boolean>(true);
  const [correctLetters, setCorrectLetters] = useState<Array<string>>([]);
  const [wrongLetters, setWrongLetters] = useState<Array<any>>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const handleKeydown = (e: any) => {
      const { key, keyCode } = e;
      if (
        (playable && keyCode >= 65 && keyCode <= 90) ||
        palatalsCode.includes(keyCode)
      ) {
        const letter = key.toLowerCase();
        if (selectedWord.includes(letter)) {
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
  }, [correctLetters, wrongLetters, playable]);

  const playAgain = () => {
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    //random word again
    selectedWord = words[Math.floor(Math.random() * words.length)];
  };

  return (
    <BodyWrapper>
      <Heading mt="10rem" mb="-5rem">
        Enter the letter from your keyboard
      </Heading>
      <GameContainer>
        <Figure wrongLetters={wrongLetters} />
        <WrongLetters wrongLetters={wrongLetters} />
        <Word selectedWord={selectedWord} correctLetters={correctLetters} />
      </GameContainer>
      <Popup
        correctLetters={correctLetters}
        wrongLetters={wrongLetters}
        selectedWord={selectedWord}
        setPlayable={setPlayable}
        playAgain={playAgain}
      />
      {showNotification && <Notification />}
    </BodyWrapper>
  );
};

export default Hangman;
