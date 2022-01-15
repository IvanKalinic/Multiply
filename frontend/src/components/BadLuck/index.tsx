import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState, memo } from "react";

const BadLuck = ({ text }: { text: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  setTimeout(() => {
    setIsOpen(false);
  }, 3000);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent h="300">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          textAlign="center"
        >
          <Text fontSize="3xl" mt="20">
            {text}
          </Text>
          <ModalCloseButton />
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default memo(BadLuck);
