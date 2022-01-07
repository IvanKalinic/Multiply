import styled from "styled-components";
import { Link } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

interface Props {
  user: any;
  admin: any;
}
const Navbar = ({ user, admin }: Props) => {
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
    window.open(
      `${process.env.REACT_APP_SERVER_BASE_URL}/auth/logout`,
      "_self"
    );
  };
  console.log(user);
  return (
    <NavbarWrapper>
      <span
        style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "20px" }}
      >
        <Link to="/">Multiply</Link>
      </span>
      {(user || admin) && (
        <Flex justifyContent="center">
          <span style={{ fontSize: "20px", marginRight: "20px" }}>
            {user?.data.username || admin?.data.username}
          </span>
          <span
            style={{ fontSize: "20px", marginRight: "20px", cursor: "pointer" }}
            onClick={logout}
          >
            Logout
          </span>
        </Flex>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
