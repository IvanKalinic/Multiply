import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getActiveGame } from "../../apis";
import { useTurnBased } from "../../context/TurnBasedContext";

const Winner = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();
  const { player, setPlayer } = useTurnBased();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (player !== "opp" && player !== "me") return;

    getActiveGame().then((data) => {
      if (data.data?.winner) setPlayer(data.data?.winner);
    });
  }, [player]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent h="300">
        <ModalCloseButton />
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          textAlign="center"
        >
          <Text fontSize="5xl" color="#9dbef5" mt="10">
            <strong>
              {player !== "opp" && player !== "me" && player} won!
            </strong>
          </Text>
          <Text fontSize="3xl" color="#9dbef5">
            Congrats!
          </Text>
          <Text mt="20" as="u">
            <Link to="/">Let's play another one</Link>
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default Winner;
