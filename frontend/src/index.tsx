import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <AdminProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AdminProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
