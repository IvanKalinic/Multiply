import styled from "styled-components";
interface Props {
  value: number;
  onClick: () => void;
  color?: boolean;
}

export const Box = ({ value, onClick, color }: Props) => {
  return (
    <TicTacToeBox onClick={onClick} color={color}>
      {value}
    </TicTacToeBox>
  );
};

export const TicTacToeBox = styled.div`
  width: 5rem;
  height: 5rem;
  border: 1px solid #000;
  text-align: center;
  line-height: 4.5rem;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  color: ${({ color }: { color: any }) => (color ? "red" : "black")};
`;
