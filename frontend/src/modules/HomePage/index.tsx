import { Link } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { HomeWrapper } from "../modules.style";
import { useAdmin } from "../../context/AdminContext";
import { useUser } from "../../context/UserContext";
import { useSocket } from "../../context/SocketContext";

const HomePage = () => {
  const { user } = useUser();
  const { admin } = useAdmin();
  const { socket } = useSocket();

  console.log(socket?.id);

  return (
    <HomeWrapper>
      {!user && !admin && (
        <>
          <Text fontSize="4xl" color="white">
            Who are you?
          </Text>
          <Flex mt="2">
            <Link to="/loginUser">
              <Button mr="4" w={300} h={50} cursor="pointer">
                Student
              </Button>
            </Link>
            <Link to="/loginAdmin">
              <Button w={300} h={50} cursor="pointer">
                Teacher
              </Button>
            </Link>
          </Flex>
        </>
      )}
    </HomeWrapper>
  );
};

export default HomePage;
