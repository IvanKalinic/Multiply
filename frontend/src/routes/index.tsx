import { Spinner } from "@chakra-ui/react";
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { fetchAllUsers } from "../apis";
import Navbar from "../components/Navbar";
import { useAdmin } from "../context/AdminContext";
import { useUser } from "../context/UserContext";
import { HomePage } from "../modules";
import { bestPlayerSort } from "../utils";

const ErrorComponent = lazy(() => import("../components/Error"));
const AdminAppPage = lazy(() => import("../modules/AdminAppPage"));
const Statistics = lazy(() => import("../modules/Statistics"));
const UserAppPage = lazy(() => import("../modules/UserAppPage"));
const AddNewUser = lazy(() => import("../modules/AddNewUser"));
const LoginAdmin = lazy(() => import("../modules/LoginAdmin"));
const LoginUser = lazy(() => import("../modules/LoginUser"));
const GameStart = lazy(() => import("../components/GameStart"));
const TicTacToePage = lazy(() => import("../components/TicTacToePage"));
const MultiplySetup = lazy(() => import("../modules/GamesSetup/MultiplySetup"));
const SingleGameSetup = lazy(
  () => import("../modules/GamesSetup/SingleGameSetup")
);
const TicTacToeSetup = lazy(
  () => import("../modules/GamesSetup/TicTacToeSetup")
);

const AppRoutes = ({
  setId,
}: {
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { user } = useUser();
  const { admin } = useAdmin();

  const [rank, setRank] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchAllUsers().then((res) => {
        bestPlayerSort(res.data).forEach((row, index) => {
          if (row.username === user.data.username) {
            setRank(index + 1);
          }
        });
      });
    }
  }, [user]);

  return (
    <Router>
      <div style={{ width: "100%" }}>
        <Navbar user={user} admin={admin} rank={rank} />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={!user ? <HomePage /> : <UserAppPage />} />
            <Route
              path="/statistics"
              element={!!admin ? <Statistics /> : <ErrorComponent />}
            />
            <Route path="/adminApp" element={<AdminAppPage />} />
            <Route path="/userApp" element={<UserAppPage />} />
            <Route path="/multiplySetup" element={<MultiplySetup />} />
            <Route path="/ticTacToeSetup" element={<TicTacToeSetup />} />
            <Route
              path="/memorySetup"
              element={<SingleGameSetup name="memory" />}
            />
            <Route
              path="/hangmanSetup"
              element={<SingleGameSetup name="hangman" />}
            />
            <Route
              path="/battleSetup"
              element={<MultiplySetup battle={true} />}
            />
            <Route path="/addNewUser" element={<AddNewUser />} />
            <Route path="/ticTacToe" element={<TicTacToePage />} />
            <Route path="/mulitplyGameStart" element={<GameStart />} />
            <Route
              path="/loginUser"
              element={
                user ? <Navigate to="/userApp" /> : <LoginUser setId={setId} />
              }
            />
            <Route
              path="/loginAdmin"
              element={
                admin ? (
                  <Navigate to="/adminApp" />
                ) : (
                  <LoginAdmin setId={setId} />
                )
              }
            />
            <Route path="*" element={<ErrorComponent />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
};

export default AppRoutes;
