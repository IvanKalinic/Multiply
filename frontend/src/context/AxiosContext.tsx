import { createContext, useContext, useMemo } from "react";
import Axios, { AxiosInstance } from "axios";

export const AxiosContext = createContext<AxiosInstance>(Axios);

export const useAxios = () => {
  const axiosContext = useContext(AxiosContext);

  if (axiosContext === undefined) {
    throw new Error("useAxios must be inside of its provider");
  }
  return axiosContext;
};

export const AxiosProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const auth = useMemo(() => {
    const axios = Axios.create({
      baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    });

    return axios;
  }, []);

  return <AxiosContext.Provider value={auth}>{children}</AxiosContext.Provider>;
};
