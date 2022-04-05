import React, { lazy, Suspense, memo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useUser } from "../context/UserContext";
import { useAdmin } from "../context/AdminContext";
import { HomePage } from "../modules";

const ErrorComponent = lazy(() => import("../components/Error"));
const AdminAppPage = lazy(() => import("../modules/AdminAppPage"));
const UserAppPage = lazy(() => import("../modules/UserAppPage"));
const AddNewUser = lazy(() => import("../modules/AddNewUser"));
const LoginAdmin = lazy(() => import("../modules/LoginAdmin"));
const LoginUser = lazy(() => import("../modules/LoginUser"));
const GameStart = lazy(() => import("../modules/GameStart"));

const AppRoutes = ({
  setId,
}: {
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { user } = useUser();
  const { admin } = useAdmin();

  return (
    <Router>
      <div style={{ width: "100%" }}>
        <Navbar user={user} admin={admin} />
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/adminApp" element={admin ? <AdminAppPage /> : null} />
            <Route path="/userApp" element={user ? <UserAppPage /> : null} />
            <Route path="/addNewUser" element={<AddNewUser />} />
            <Route path="/gameStart" element={<GameStart />} />
            <Route
              path="/loginUser"
              element={user ? <Navigate to="/userApp" /> : <LoginUser />}
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

export default memo(AppRoutes);
