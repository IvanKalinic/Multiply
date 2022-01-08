import React, { createContext, useContext, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type ContextType = {
  admin: any;
  setAdmin: React.Dispatch<React.SetStateAction<any>>;
};

const AdminContext = createContext<ContextType>({
  admin: null,
  setAdmin: () => null,
});

export const useAdmin = () => {
  const adminContext = useContext(AdminContext);

  if (adminContext === undefined) {
    throw new Error("useAuth must be inside of its provider");
  }
  return adminContext;
};

interface Props {
  children: React.ReactChild;
}

export const AdminProvider = ({ children }: Props) => {
  const [admin, setAdmin] = useLocalStorage("admin", null);
  const value = { admin, setAdmin };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
