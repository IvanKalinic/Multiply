import styled from "styled-components";
import { useState } from "react";
import { NumberWrapper } from "../styles";

export const BoardItem = ({ value, id }: { value: number; id: number }) => {
  const [color, setColor] = useState<boolean>(false);

  // const NumberWrapper = styled.div`
  //   cursor: pointer;
  //   background-color: ${color ? "#cf084a" : "#9dbef5"};
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   height: 60px;
  //   width: 60px;
  //   margin: 2px 0 2px 0;
  // `;
  // console.log(color);
  return (
    <NumberWrapper color={color} onClick={() => setColor(!color)}>
      {value}
    </NumberWrapper>
  );
};
