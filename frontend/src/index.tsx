import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";
import { GameProvider } from "./context/GameContext";
import { TicTacToeProvider } from "./context/TicTacToeContext";
import { AxiosProvider } from "./context/AxiosContext";
import { OpponentsProvider } from "./context/OpponentsContext";
import { TurnBasedProvider } from "./context/TurnBasedContext";

ReactDOM.render(
  <React.StrictMode>
    <AxiosProvider>
      <OpponentsProvider>
        <AdminProvider>
          <UserProvider>
            <GameProvider>
              <TicTacToeProvider>
                <TurnBasedProvider>
                  <App />
                </TurnBasedProvider>
              </TicTacToeProvider>
            </GameProvider>
          </UserProvider>
        </AdminProvider>
      </OpponentsProvider>
    </AxiosProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
