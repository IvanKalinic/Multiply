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
          <Text fontSize="5xl" color="black" mb="2" as="abbr">
            Hello teacher {admin.data.username} !
          </Text>
          <Flex mb="4" flexDirection="column">
            <Button mr="4" mb="2rem" w={300}>
              <Text fontSize="1.3rem">
                <Link to="/addNewUser">Add new users here</Link>
              </Text>
            </Button>
            <Button mr="4" mb="2rem" w={300}>
              <Text fontSize="1.3rem">
                <Link to="/ticTacToeSetup">Tic Tac Toe</Link>
              </Text>
            </Button>
            <Button mr="4" mb="2rem" w={300}>
              <Text fontSize="1.3rem">
                <Link to="/multiplySetup">Multiply</Link>
              </Text>
            </Button>
          </Flex>
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default AdminAppPage;
