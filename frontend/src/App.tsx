import "./App.css";
import { GameBoard } from "./components/sharedcomponents/GameBoard";
import styled from "styled-components";
function App() {
  const ParentContainer = styled.div`
    display: flex;
    justify-content: center;
  `;
  return (
    <ParentContainer>
      <GameBoard />
    </ParentContainer>
  );
}

export default App;
