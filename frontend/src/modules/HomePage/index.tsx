import { Link } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { HomeWrapper } from "../modules.style";
import { useAdmin } from "../../context/AdminContext";
import { useUser } from "../../context/UserContext";

const HomePage = () => {
  const { user } = useUser();
  const { admin } = useAdmin();

  return (
    <HomeWrapper>
      {!user && !admin && (
        <>
          <Text fontSize="4xl" color="white">
            Who are you?
          </Text>
          <Flex mt="2">
            <Button mr="4" w={300} h={50}>
              <Link to="/loginUser">Student</Link>
            </Button>
            <Button w={300} h={50}>
              <Link to="/loginAdmin">Teacher</Link>
            </Button>
          </Flex>
        </>
      )}
    </HomeWrapper>
  );
};

export default HomePage;
