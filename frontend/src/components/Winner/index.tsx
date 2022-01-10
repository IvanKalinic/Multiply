import { Text, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Winner = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent h="300">
        <Text fontSize="5xl">{user?.data.username} wins !!!</Text>
      </ModalContent>
    </Modal>
  );
};

export default Winner;
