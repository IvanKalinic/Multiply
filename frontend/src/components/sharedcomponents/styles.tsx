import styled from "styled-components";

export const GameBoardWrapper = styled.div`
  margin-top: 0.5rem;
  height: 31.25rem;
  width: 31.25rem;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0.125rem;
`;

export const NumberWrapper = styled.div`
  cursor: pointer;
  background-color: ${({ color }: { color: any }) =>
    color ? color : "#9dbef5"};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.75rem;
  width: 3.75rem;
  margin: 0.125rem 0 0.125rem 0;
  border-radius: 0.3125rem;

  &:hover {
    border: 0.125rem solid #0069a6;
  }
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

export const Details = styled.div`
  position: relative;
  top: 3.125rem;
  left: -9.375rem;
`;
