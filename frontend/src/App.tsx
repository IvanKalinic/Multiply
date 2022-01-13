import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import { ParentContainer } from "./App.style";

const App = () => {
  return (
    <ChakraProvider>
      <ParentContainer>
        <AppRoutes />
      </ParentContainer>
    </ChakraProvider>
  );
};

export default App;
