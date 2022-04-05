import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

type ContextType = {
  socket: any;
  setSocket: React.Dispatch<React.SetStateAction<any>>;
};

const SocketContext = createContext<ContextType>({
  socket: null,
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
  const [socket, setSocket] = useState<any>(
    io(`${process.env.REACT_APP_SERVER_BASE_URL}`)
  );

  useEffect(() => {
    setSocket(
      io(`${process.env.REACT_APP_SERVER_BASE_URL}`, {
        query: { id },
      })
    );

    return () => socket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
