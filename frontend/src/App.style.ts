import styled from "styled-components";
import MathPicture from "./assets/images/math.png";

export const ParentContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  text-align: center;
  min-height: 100vh;
  background-image: url(${MathPicture});
  background-size: 100% 100%;
  object-fit: cover;
`;
