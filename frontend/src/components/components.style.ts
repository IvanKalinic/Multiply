import styled from "styled-components";

export const NavbarWrapper = styled.div`
  width: 100%;
  height: 50px;
  background-color: #326da8;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
  h1 {
    font-size: 10rem;
  }
  h3 {
    color: hsl(209, 34%, 30%);
    margin-bottom: 1.5rem;
  }
`;
