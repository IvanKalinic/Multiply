import styled, { keyframes } from "styled-components";

export const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
`;

export const TicTacToeContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const MemoryCardsContainer = styled.div`
  height: 43.75rem;
  width: 43.75rem;
  display: grid;
  grid-template: repeat(4, 1fr) / repeat(4, 1fr);
  gap: 1rem;
`;

const hideImageAnimation = keyframes`
  0%, 70%{
    transform: scale(1);
  }
  100%{
    transform: scale(0);
  }
`;

export const CardContainer = styled.div`
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.3125rem;
  transform: rotateY(180deg);
  animation: 2s hideCard linear;
  transition: transform 0.5s;
  cursor: pointer;

  div {
    max-width: 80%;
    max-height: 80%;
    transition: transform 0.5s;
    transform: ${({ itemClassName }: { itemClassName: string }) =>
      itemClassName === "active" ? "scale(1)" : "scale(0)"};
    animation: 2s ${hideImageAnimation} linear;
  }

  transform: ${({ itemClassName }: { itemClassName: string }) =>
    itemClassName === "active" ? "rotateY(0)" : null};
  background-color: ${({ itemClassName }: { itemClassName: string }) =>
    itemClassName === "wrong" ? "#fd245a" : "correct" ? "#65e469" : "#fff"};
`;
