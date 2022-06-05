import { Link, useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext";
import { useAdmin } from "../../context/AdminContext";
import { NavbarWrapper } from "../components.style";
import "./index.scss";

interface Props {
  user: any;
  admin: any;
  rank?: number;
}

const Navbar = ({ user, admin, rank }: Props) => {
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

  console.log(rank);
  return (
    <NavbarWrapper>
      <span
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginLeft: "1.25rem",
        }}
      >
        <Text fontSize="2xl">
          <Link to="/">Multiply</Link>
        </Text>
      </span>
      {(!!user || !!admin) && (
        <Flex justifyContent="center">
          {!!admin && (
            <span style={{ fontSize: "1.25rem", marginRight: "1.25rem" }}>
              <Link to="/statistics" className="statistics-link">
                Statistics
              </Link>
            </span>
          )}

          <span style={{ fontSize: "1.25rem", marginRight: "1.25rem" }}>
            {user ? (
              user?.data?.username
            ) : admin ? (
              <Link to="/adminApp" className="statistics-link">
                {admin?.data?.username}
              </Link>
            ) : null}
          </span>

          <span
            style={{
              fontSize: "1.25rem",
              marginRight: "1.25rem",
              marginLeft: "-0.75rem",
              borderBottom: "1px solid",
            }}
          >{`#${rank}`}</span>

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
