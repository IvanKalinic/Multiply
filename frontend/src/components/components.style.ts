import styled from "styled-components";

export const NavbarWrapper = styled.div`
  width: 100%;
  height: 3.2rem;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  zindex: 10000;
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

export const PawnWrapper = styled.div`
  height: 3rem;
  width: 3rem;
  background-color: #cf084a;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: 0.5rem;
`;
