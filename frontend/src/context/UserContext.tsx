import React, { createContext, useContext, useState, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type ContextType = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  numberOfClicks: number;
  setNumberOfClicks: React.Dispatch<React.SetStateAction<number>>;
};

const UserContext = createContext<ContextType>({
  user: null,
  setUser: () => null,
  numberOfClicks: 0,
  setNumberOfClicks: () => null,
});

export const useUser = () => {
  const userContext = useContext(UserContext);

  if (userContext === undefined) {
    throw new Error("useAuth must be inside of its provider");
  }
  return userContext;
};

interface Props {
  children: React.ReactChild;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [numberOfClicks, setNumberOfClicks] = useState(0);

  const value = useMemo(
    () => ({ user, setUser, numberOfClicks, setNumberOfClicks }),
    [user, setUser, numberOfClicks, setNumberOfClicks]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
