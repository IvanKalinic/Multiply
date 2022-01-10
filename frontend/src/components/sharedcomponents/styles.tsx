import styled from "styled-components";

export const GameBoardWrapper = styled.div`
  margin-top: 8px;
  height: 500px;
  width: 500px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 2px;
`;

export const NumberWrapper = styled.div`
  cursor: pointer;
  background-color: ${({ color }: { color: boolean }) =>
    color ? "#cf084a" : "#9dbef5"};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 60px;
  margin: 2px 0 2px 0;
`;

export const Overlay = styled.div`
  background: rgba(49, 49, 49, 0.8);
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
`;
