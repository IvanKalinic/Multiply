import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";
import { GameProvider } from "./context/GameContext";
import { TicTacToeProvider } from "./context/TicTacToeContext";
import { AxiosProvider } from "./context/AxiosContext";

ReactDOM.render(
  <React.StrictMode>
    <AxiosProvider>
      <AdminProvider>
        <UserProvider>
          <GameProvider>
            <TicTacToeProvider>
              <App />
            </TicTacToeProvider>
          </GameProvider>
        </UserProvider>
      </AdminProvider>
    </AxiosProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
