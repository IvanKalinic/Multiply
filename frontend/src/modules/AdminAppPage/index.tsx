import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { MenuWrapper } from "../../styles";

const AdminAppPage = () => {
  const { admin } = useAdmin();

  return (
    <Flex justifyContent="center">
      <MenuWrapper>
        <Flex
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text fontSize="3xl" color="black" mb="2rem" as="abbr">
            Hello teacher {admin.data.username} ! <br /> Welcome to setup page
          </Text>
          <Flex mb="4" flexDirection="column">
            <Link to="/addNewUser">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Add new users here
              </Button>
            </Link>
            <Link to="/ticTacToeSetup">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Tic Tac Toe
              </Button>
            </Link>
            <Link to="/multiplySetup">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Multiply
              </Button>
            </Link>
            <Link to="/memorySetup">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Memory Game
              </Button>
            </Link>
            <Link to="/hangmanSetup">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Hangman
              </Button>
            </Link>
            <Link to="/battleSetup">
              <Button mr="4" mb="2rem" w={300} fontSize="1.3rem">
                Battle
              </Button>
            </Link>
          </Flex>
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default AdminAppPage;
