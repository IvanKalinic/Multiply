import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import styled from "styled-components";
import AppRoutes from "./routes";
import MathPicture from "./assets/images/math.png";

const App = () => {
  const ParentContainer = styled.div`
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    text-align: center;
    min-height: 100vh;
    background-image: url(${MathPicture});
    background-size: 100% 100%;
    object-fit: cover;
  `;

  return (
    <ChakraProvider>
      <ParentContainer>
        <AppRoutes />
      </ParentContainer>
    </ChakraProvider>
  );
};

export default App;
