import styled from "styled-components";

interface Props {
  index: number;
  turn: (index: number) => void;
  value: number;
}

export const Box = ({ index, turn, value }: Props) => {
  return <TicTacToeBox onClick={() => turn(index)}>{value}</TicTacToeBox>;
};

export const TicTacToeBox = styled.div`
  width: 5rem;
  height: 5rem;
  border: 1px solid #000;
  text-align: center;
  line-height: 4.5rem;
  font-size: 3rem;
  font-weight: bold;
`;
