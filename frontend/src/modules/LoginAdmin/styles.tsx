import styled from "styled-components";

export const LoginWrapper = styled.div`
  margin-top: 1.25rem;
  width: 70%;
  height: calc(100vh - 9.375rem);
  -webkit-box-shadow: 0 0.3125rem 2rem -1.3125rem rgba(66, 68, 90, 1);
  -moz-box-shadow: 0 0.3125rem 2rem -1.3125rem rgba(66, 68, 90, 1);
  box-shadow: 0 0.3125rem 2rem -1.3125rem rgba(66, 68, 90, 1);
  display: flex;
  align-items: center;
  border-radius: 1.25rem;
  background-color: rgb(255, 255, 255, 0.5);
`;

export const SubmitButton = styled.button`
    width: 12.5rem;
    background-color: ${({ login }: { login: boolean | undefined }) =>
      login ? `#1eb6f7` : `#182740`};
    color: white;
   
    font-weight: bold;
    border: none;
    padding: 0.9375rem 1.25rem;
    border-radius: 0.3125rem;
    cursor: pointer;

    &:hover {
      color: ${({ login }: { login: boolean | undefined }) =>
        login ? `#182740` : `#1eb6f7`};
      opacity: 0.95;
      transform: translateY(0.125rem);
    }
  }`;

export const LineDivider = styled.div`
  width: 0.0625rem;
  height: 70%;
  background-color: black;
  position: absolute;
  top: 5rem;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 0;
`;

export const OrSign = styled.div`
  border: 0.125rem solid lightgray;
  border-radius: 50%;
  padding: 0.625rem;
  color: gray;
  background-color: white;
  font-weight: bold;
  z-index: 1;
`;
