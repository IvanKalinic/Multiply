import { useState } from "react";
import styled from "styled-components";

export const BoardItem = ({ value, id }: { value: number; id: number }) => {
  const [color, setColor] = useState<boolean>(false);

  const NumberWrapper = styled.div`
    cursor: pointer;
    background-color: ${color ? "#cf084a" : "#9dbef5"};
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  console.log(color);
  return (
    <NumberWrapper onClick={() => setColor(!color)}>{value}</NumberWrapper>
  );
};
