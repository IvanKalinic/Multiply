import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";

const HomePage = () => {
  const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;

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
