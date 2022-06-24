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
  width: 6rem;
  height: 6rem;
  border: 2px solid #000;
  text-align: center;
  font-size: 4rem;
  font-weight: bold;
  cursor: pointer;
  color: ${({ color }: { color: any }) => (color ? "red" : "black")};
`;
