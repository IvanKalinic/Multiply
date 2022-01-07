import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  LoginAdmin,
  LoginUser,
  HomePage,
  AdminAppPage,
  UserAppPage,
  AddNewUser,
} from "../modules";
import { useUser } from "../context/UserContext";
import { useAdmin } from "../context/AdminContext";

const AppRoutes = () => {
  const { user } = useUser();
  const { admin } = useAdmin();

  return (
    <Router>
      <div style={{ width: "100%" }}>
        <Navbar user={user} admin={admin} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/adminApp" element={<AdminAppPage />} />
          <Route path="/userApp" element={<UserAppPage />} />
          <Route path="/addNewUser" element={<AddNewUser />} />
          <Route
            path="/loginUser"
            element={user ? <Navigate to="/userApp" /> : <LoginUser />}
          />
          <Route
            path="/loginAdmin"
            element={admin ? <Navigate to="/adminApp" /> : <LoginAdmin />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
