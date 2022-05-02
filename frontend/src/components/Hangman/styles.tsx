import styled from "styled-components";

export const BodyWrapper = styled.div`
  background-color: #34495e;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 80vh;
  width: 80vw;
  margin: 0;
  overflow: hidden;
`;

export const GameContainer = styled.div`
  padding: 1.25rem 2rem;
  position: relative;
  margin: auto;
  height: 22.25rem;
  width: 28.125rem;
`;

export const FigureContainer = styled.svg`
  fill: transparent;
  stroke: #fff;
  stroke-width: 4px;
  stroke-linecap: round;
`;

export const WrongLettersContainer = styled.div`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  display: flex;
  flex-direction: column;
  text-align: right;

  p {
    margin: 0 0 0.3125rem;
  }
`;

export const WordWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 0.625rem;
  left: 50%;
  transform: translateX(-50%);
`;

export const LetterWrapper = styled.div`
  border-bottom: 0.2rem solid #2980b9;
  display: inline-flex;
  font-size: 2rem;
  align-items: center;
  justify-content: center;
  margin: 0 0.2rem;
  height: 3rem;
  width: 1.25rem;
`;

export const PopupContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  align-items: center;
  justify-content: center;
`;

export const PopupWrapper = styled.div`
  background: #2980b9;
  border-radius: 0.3125rem;
  box-shadow: 0 1rem 0.625rem 0.3125 rgba(0, 0, 0, 0.1);
  padding: 1.25rem;
  text-align: center;
`;

export const PopupButton = styled.button`
  cursor: pointer;
  background-color: #fff;
  color: #2980b9;
  border: 0;
  margin-top: 1.25rem;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 0;
  }
`;

export const NotificationContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.625rem 0.625rem 0 0;
  padding: 1rem 1.25rem;
  position: absolute;
  bottom: -3rem;
  transition: transform 0.3s ease-in-out;
  transform: translateY(-12rem);
`;
