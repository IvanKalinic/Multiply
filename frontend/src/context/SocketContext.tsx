import React, { createContext, useContext, useMemo, useState } from "react";
import io from "socket.io-client";

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
  const socketIo = useMemo(
    () =>
      io(`${process.env.REACT_APP_SERVER_BASE_URL}`, {
        query: { id },
      }),
    [id]
  );

  const [socket, setSocket] = useState<any>(socketIo);

  const value = useMemo(() => ({ socket, setSocket }), [socket, setSocket]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
