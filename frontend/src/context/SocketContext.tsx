import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import io from "socket.io-client";
import { useUser } from "./UserContext";

type ContextType = {
  socket: any;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
};

const defaultSocket = io(`${process.env.REACT_APP_SERVER_BASE_URL}`);

const SocketContext = createContext<ContextType>({
  socket: defaultSocket,
  setSocket: () => null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

interface Props {
  children: React.ReactChild;
  id: string;
}

export const SocketProvider = ({ id, children }: Props) => {
  const [socket, setSocket] = useState<any>(defaultSocket);
  const { user } = useUser();

  useEffect(() => {
    setSocket(
      io(`${process.env.REACT_APP_SERVER_BASE_URL}`, {
        query: { id },
      })
    );

    return () => socket.close();
  }, [id, user]);

  console.log(id);
  console.log(socket);
  console.log(user);

  const value = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
