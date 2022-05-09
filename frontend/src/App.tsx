import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import AppRoutes from "./routes";
import { ParentContainer } from "./App.style";
import { SocketProvider } from "./context/SocketContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { useUser } from "./context/UserContext";
import { VideoCallProvider } from "./context/VideoCallContext";

const App = () => {
  const { user } = useUser();
  const [id, setId] = useLocalStorage("id", "");

  return (
    <ChakraProvider>
      <SocketProvider id={user?.data?.username ? id : ""}>
        <VideoCallProvider>
          <ParentContainer>
            <AppRoutes setId={setId} />
          </ParentContainer>
        </VideoCallProvider>
      </SocketProvider>
    </ChakraProvider>
  );
};

export default App;
