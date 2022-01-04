import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

  return (
    <NavbarWrapper>
      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
        <Link to="/">Multiply</Link>
      </span>
    </NavbarWrapper>
  );
};

export default Navbar;
