import {
  Button,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteActiveGames,
  getActiveGame,
  updateBattleArrayInActiveGame,
} from "../../apis";
import { useTurnBased } from "../../context/TurnBasedContext";
import { useUser } from "../../context/UserContext";
import { PopupButton } from "../Hangman/styles";

interface Props {
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  finalMessage?: string;
  finalMessageRevealWord?: string;
  battleWinner?: string;
  playAgain?: () => void;
  gameOver?: boolean;
  setGameOver?: React.Dispatch<React.SetStateAction<boolean>>;
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
  multiply?: boolean;
  hangman?: boolean;
  memory?: boolean;
  battle?: boolean;
}
const Winner = ({
  setRerenderGame,
  finalMessage,
  finalMessageRevealWord,
  battleWinner,
  gameOver,
  setGameOver,
  multiply,
  hangman,
  memory,
  battle,
  setGameType,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const { player, setPlayer, room } = useTurnBased();
  const [isHandleNext, setIsHandleNext] = useState<boolean>(false);
  const { user } = useUser();
  const [nextGameToPlay, setNextGameToPlay] = useState<any>(null);

  const handleClose = () => {
    setIsOpen(false);
    if (gameOver) setGameOver!(false);
    navigate("/");
  };

  useEffect(() => {
    if (player !== "opp" && player !== "me") return;

    getActiveGame().then((data) => {
      if (data.data?.winner) setPlayer(data.data?.winner);
    });
  }, [player]);

  const handleNext = async () => {
    if (!battle || battle === undefined) {
      setIsHandleNext(true);
    } else {
      if (memory) {
        setRerenderGame!(4);
        updateBattleArrayInActiveGame(3, user.data.username);
        return;
      }
      if (hangman) {
        setRerenderGame!(1);
        updateBattleArrayInActiveGame(4, user.data.username);
        return;
      }
      if (multiply) {
        setRerenderGame!(0);
        updateBattleArrayInActiveGame(1, user.data.username);
        return;
      }
      navigate("/");
    }
  };

  // const checkNext = async () => {
  if (!multiply && !battle) {
    getActiveGame().then((data) => {
      let arrayLength = data.data?.length;
      let nextGame = null;
      let nextGameIndex = data.data?.map((data: any, index: number) => {
        console.log(data.opponents);
        if (
          (data.opponents.includes(user.data.username) ||
            data.user === user.data.username) &&
          !data.winner
        ) {
          return index + 1;
        }
      });
      if (!!nextGameIndex && nextGameIndex < arrayLength) {
        nextGame = data.data?.find(
          (data: any, index: number) => index === nextGameIndex
        );
        setNextGameToPlay(nextGame);
      }
    });
  }

  useEffect(() => {
    if (!isHandleNext) return;

    if (!!nextGameToPlay) {
      setGameType!(6);
      deleteActiveGames();
      setRerenderGame!(nextGameToPlay?.type);
      handleClose();
      navigate("/");
    } else {
      setGameType!(0);
      setRerenderGame!(0);
      handleClose();
      navigate("/");
    }
  }, [nextGameToPlay, isHandleNext, setGameType]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent h={!finalMessage ? "300" : "15vh"}>
        <ModalCloseButton />
        {gameOver ? (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            textAlign="center"
          >
            <Text fontSize="5xl" color="#9dbef5" mt="10" cursor="pointer">
              <strong>Game over!</strong>
            </Text>
            <Button mt="20" as="u" onClick={handleNext}>
              Let's play next game in your queue
            </Button>
          </Flex>
        ) : !finalMessage ? (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            textAlign="center"
          >
            <Text fontSize="5xl" color="#9dbef5" mt="10">
              <strong>
                {player !== "opp" && player !== "me" && player} won{" "}
                {!!battleWinner && "this match"}!
              </strong>
            </Text>

            <Text fontSize="3xl" color="#9dbef5">
              {!!battleWinner
                ? `${battleWinner} won overall battle match and got 10 points award!`
                : ""}
            </Text>
            <Button mt="20" as="u" onClick={handleNext} cursor="pointer">
              Let's play next game in your queue
            </Button>
          </Flex>
        ) : (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            textAlign="center"
          >
            <h2>{finalMessage}</h2>
            {!!finalMessageRevealWord ? (
              <>
                <h3>{finalMessageRevealWord}</h3>
                <PopupButton>
                  <Button mt="20" as="u" onClick={handleNext}>
                    Let's play next game in your queue
                  </Button>
                </PopupButton>
              </>
            ) : (
              <Button mt="20" as="u" onClick={handleNext} cursor="pointer">
                Let's play next game in your queue
              </Button>
            )}
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Winner;
