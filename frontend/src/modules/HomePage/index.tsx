import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const HomePage = () => {
  const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;

  return (
    <HomeWrapper>
      Who are you?
      <Link to="/loginUser">Student</Link>
      <Link to="/loginAdmin">Teacher</Link>
    </HomeWrapper>
  );
};

export default HomePage;
