import React, { createContext, useContext, useState, useMemo } from "react";

type ContextType = {
  opponents: Array<any>;
  setOpponents: React.Dispatch<React.SetStateAction<Array<any>>>;
};

const OpponentsContextProvider = createContext<ContextType>({
  opponents: [],
  setOpponents: () => null,
});

export const useOpponents = () => {
  const opponentsContext = useContext(OpponentsContextProvider);

  if (opponentsContext === undefined) {
    throw new Error("useOpponents must be inside of its provider");
  }
  return opponentsContext;
};

interface Props {
  children: React.ReactChild;
}

export const OpponentsProvider = ({ children }: Props) => {
  const [opponents, setOpponents] = useState<Array<any>>([]);

  const value = useMemo(
    () => ({
      opponents,
      setOpponents,
    }),
    [opponents, setOpponents]
  );

  return (
    <OpponentsContextProvider.Provider value={value}>
      {children}
    </OpponentsContextProvider.Provider>
  );
};
