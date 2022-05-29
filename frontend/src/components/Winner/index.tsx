import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getActiveGame, updateBattleArrayInActiveGame } from "../../apis";
import { useTurnBased } from "../../context/TurnBasedContext";
import { PopupButton } from "../Hangman/styles";

interface Props {
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  finalMessage?: string;
  finalMessageRevealWord?: string;
  user?: any;
  battleWinner?: string;
  playAgain?: () => void;
}
const Winner = ({
  setRerenderGame,
  finalMessage,
  finalMessageRevealWord,
  user,
  battleWinner,
  playAgain,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const { player, setPlayer } = useTurnBased();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  const nextGame = () => {
    setRerenderGame!(4);
    navigate("/");
  };

  useEffect(() => {
    if (player !== "opp" && player !== "me") return;

    getActiveGame().then((data) => {
      if (data.data?.winner) setPlayer(data.data?.winner);
    });
  }, [player]);

  const handleNext = () => {
    setRerenderGame!(1);
    updateBattleArrayInActiveGame(4, user.data.username);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent h={!finalMessage ? "300" : "15vh"}>
        <ModalCloseButton />
        {!finalMessage ? (
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexWrap="wrap"
            textAlign="center"
          >
            {!battleWinner && (
              <Text fontSize="5xl" color="#9dbef5" mt="10">
                <strong>
                  {player !== "opp" && player !== "me" && player} won!
                </strong>
              </Text>
            )}
            <Text fontSize="3xl" color="#9dbef5">
              {!!battleWinner
                ? `${battleWinner} just won battle match and got 10 points award!`
                : "Congrats!"}
            </Text>
            <Text mt="20" as="u">
              <Link to="/userApp" onClick={nextGame}>
                Let's play next game in your queue
              </Link>
            </Text>
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
                  <Link to="/userApp" onClick={playAgain}>
                    Play new one
                  </Link>
                </PopupButton>
              </>
            ) : (
              <PopupButton>
                <Link to="/userApp" onClick={handleNext}>
                  Let's play next game in your queue
                </Link>
              </PopupButton>
            )}
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Winner;
