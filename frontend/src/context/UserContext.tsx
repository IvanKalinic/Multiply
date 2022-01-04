import React, { createContext, useContext, useState, useEffect } from "react";

type ContextType = {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
};

const UserContext = createContext<ContextType>({
  user: null,
  setUser: () => null,
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
  const [user, setUser] = useState(null);
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
