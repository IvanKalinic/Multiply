import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";
import { GameProvider } from "./context/GameContext";
import { TicTacToeProvider } from "./context/TicTacToeContext";

ReactDOM.render(
  <React.StrictMode>
    <AdminProvider>
      <UserProvider>
        <GameProvider>
          <TicTacToeProvider>
            <App />
          </TicTacToeProvider>
        </GameProvider>
      </UserProvider>
    </AdminProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
