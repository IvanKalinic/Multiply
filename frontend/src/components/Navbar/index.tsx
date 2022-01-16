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
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginLeft: "1.25rem",
        }}
      >
        {(user || admin) && (
          <Text fontSize="2xl">
            <Link to="/">Multiply</Link>
          </Text>
        )}
      </span>
      {(!!user || !!admin) && (
        <Flex justifyContent="center">
          <span style={{ fontSize: "1.25rem", marginRight: "1.25rem" }}>
            {user ? user?.data?.username : admin ? admin?.data?.username : null}
          </span>
          {user || admin ? (
            <span
              style={{
                fontSize: "1.25rem",
                marginRight: "1.25rem",
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
