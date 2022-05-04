import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import { ParentContainer } from "./App.style";
import { SocketProvider } from "./context/SocketContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { useUser } from "./context/UserContext";

const App = () => {
  const { user } = useUser();
  const [id, setId] = useLocalStorage("id", "");

  return (
    <ChakraProvider>
      <SocketProvider id={user?.data?.username ? id : ""}>
        <ParentContainer>
          <AppRoutes setId={setId} />
        </ParentContainer>
      </SocketProvider>
    </ChakraProvider>
  );
};

export default App;
