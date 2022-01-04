import { useNavigate } from "react-router-dom";
import { LoginWrapper, LineDivider, OrSign } from "./styles";
import { useAdmin } from "../../context/AdminContext";
import { Flex, Heading } from "@chakra-ui/react";
import { Login, Register } from "./components";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   let user = {
  //     username: username.current.value,
  //     email: email.current.value,
  //     password: password.current.value,
  //   };
  //   if (loginAccordion) {
  //     try {
  //       const newUser = await axios.post("http://localhost:5000/manual/login", {
  //         user,
  //       });
  //       // handleRegister();
  //       setUser(newUser);
  //       navigate("/");
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     return;
  //   }
  //   if (registerAccordion) {
  //     if (passwordAgain.current.value !== password.current.value) {
  //       passwordAgain.current.setCustomValidity("Passwords don't match!");
  //       return;
  //     }
  //     try {
  //       await axios.post("http://localhost:5000/manual/register", {
  //         user,
  //       });
  //       handleLogin();
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  //   return;
  // };

  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Heading>Login with your credentials</Heading>
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
