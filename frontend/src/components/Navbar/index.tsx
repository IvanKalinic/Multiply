import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import { useUser } from "../../context/UserContext";
import { useAdmin } from "../../context/AdminContext";

interface Props {
  user: any;
  admin: any;
}

const Navbar = ({ user, admin }: Props) => {
  const { setUser } = useUser();
  const { setAdmin } = useAdmin();
  const navigate = useNavigate();

  const NavbarWrapper = styled.div`
    width: 100%;
    height: 50px;
    background-color: #326da8;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;

  const logout = () => {
    if (user) {
      setUser(null);
    }
    if (admin) {
      setAdmin(null);
    }
    navigate("/");
  };

  console.log(user);
  console.log(admin);

  return (
    <NavbarWrapper>
      <span
        style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "20px" }}
      >
        <Link to="/">Multiply</Link>
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
