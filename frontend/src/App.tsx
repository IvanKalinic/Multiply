import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import { ParentContainer } from "./App.style";
import { SocketProvider } from "./context/SocketContext";
import useLocalStorage from "./hooks/useLocalStorage";

const App = () => {
  const [id, setId] = useLocalStorage("id", "random");

  return (
    <ChakraProvider>
      <SocketProvider id={id}>
        <ParentContainer>
          <AppRoutes setId={setId} />
        </ParentContainer>
      </SocketProvider>
    </ChakraProvider>
  );
};

export default App;
