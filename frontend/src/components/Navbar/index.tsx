import { Link, useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext";
import { useAdmin } from "../../context/AdminContext";
import { NavbarWrapper } from "../components.style";

interface Props {
  user: any;
  admin: any;
}

const Navbar = ({ user, admin }: Props) => {
  const { setUser } = useUser();
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();

  const logout = () => {
    if (user) {
      setUser(null);
    }
    if (admin) {
      setAdmin(null);
    }
    navigate("/");
  };

  return (
    <NavbarWrapper>
      <span
        style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "20px" }}
      >
        {(user || admin) && (
          <Text fontSize="2xl">
            <Link to="/">Multiply</Link>
          </Text>
        )}
      </span>
      {(!!user || !!admin) && (
        <Flex justifyContent="center">
          <span style={{ fontSize: "20px", marginRight: "20px" }}>
            {user ? user?.data?.username : admin ? admin?.data?.username : null}
          </span>
          {user || admin ? (
            <span
              style={{
                fontSize: "20px",
                marginRight: "20px",
                cursor: "pointer",
              }}
              onClick={logout}
            >
              Logout
            </span>
          ) : null}
        </Flex>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
