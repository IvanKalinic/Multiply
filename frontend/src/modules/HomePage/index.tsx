import { Link } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { HomeWrapper } from "../modules.style";

const HomePage = () => {
  return (
    <HomeWrapper>
      Who are you?
      <Flex mt="2">
        <Button mr="4" w={150}>
          <Link to="/loginUser">Student</Link>
        </Button>
        <Button w={150}>
          <Link to="/loginAdmin">Teacher</Link>
        </Button>
      </Flex>
    </HomeWrapper>
  );
};

export default HomePage;
