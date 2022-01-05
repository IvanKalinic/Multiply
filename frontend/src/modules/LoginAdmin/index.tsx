import { LoginWrapper, LineDivider, OrSign } from "./styles";
import { Flex, Heading } from "@chakra-ui/react";
import { Login, Register } from "./components";

const LoginAdmin = () => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Heading mt="2">Login with your credentials</Heading>
      <LoginWrapper>
        <Login />
        <LineDivider />
        <OrSign>OR</OrSign>
        <Register />
      </LoginWrapper>
    </Flex>
  );
};

export default LoginAdmin;
