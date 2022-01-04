import styled from "styled-components";

export const LoginWrapper = styled.div`
  margin-top: 20px;
  width: 80%;
  height: calc(100vh - 150px);
  -webkit-box-shadow: 0px 5px 33px -21px rgba(66, 68, 90, 1);
  -moz-box-shadow: 0px 5px 33px -21px rgba(66, 68, 90, 1);
  box-shadow: 0px 5px 33px -21px rgba(66, 68, 90, 1);
  display: flex;
  align-items: center;
  border-radius: 20px;
`;

export const SubmitButton = styled.button`
    width: 200px;
    background-color: ${({ login }: { login: boolean | undefined }) =>
      login ? `#1eb6f7` : `#182740`};
    color: white;
   
    font-weight: bold;
    border: none;
    padding: 15px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      color: ${({ login }: { login: boolean | undefined }) =>
        login ? `#182740` : `#1eb6f7`};;
      opacity: 0.95;
      transform: translateY(2px);
    }
  }`;

export const LineDivider = styled.div`
  width: 0.5px;
  height: 70%;
  background-color: lightgray;
  position: absolute;
  top: 4rem;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
`;

export const OrSign = styled.div`
  border: 2px solid lightgray;
  border-radius: 50%;
  padding: 10px;
  color: gray;
  background-color: white;
  font-weight: bold;
`;
