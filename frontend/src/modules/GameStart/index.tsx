import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchQuestions } from "../../apis";
import Pawns from "../../components/Pawns";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { useAxios } from "../../context/AxiosContext";
import { useGame } from "../../context/GameContext";
import { useSocket } from "../../context/SocketContext";
import { useTurnBased } from "../../context/TurnBasedContext";
import { useUser } from "../../context/UserContext";
import { MenuWrapper } from "../../styles";

const GameStart = () => {
  const { questions, setQuestions } = useGame();
  const { user } = useUser();
  const axios = useAxios();
  const { socket } = useSocket();
  const {
    room,
    setRoom,
    opponents,
    setOpponents,
    setPlayer,
    setPlayerType,
    setWinner,
    myTurn,
    setMyTurn,
    setHasOpponent,
    turnNumber,
    setTurnNumber,
    setGame,
  } = useTurnBased();

  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");

  const restart = () => {
    setGame([]);
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  useEffect(() => {
    const fetchGameDetails = (async () => {
      await axios.get(`/game`).then((res) => {
        setRoom(res?.data[0]?.room);
        setOpponents(res?.data[0]?.opponents);
        setCategory(res?.data[0]?.category);
        setDifficulty(res?.data[0]?.difficulty);
      });
    })();
  }, []);

  useEffect(() => {
    const fetchGameQuestions = (async () => {
      await fetchQuestions(category, difficulty).then((data) =>
        setQuestions(data.data)
      );
    })();
  }, [category, difficulty]);

  useEffect(() => {
    socket?.on("playerTurn", (json: any) => {
      setGame(json.g);
      if (!myTurn) setMyTurn(true);
      setPlayer(json.value);
    });

    socket?.on("restart", () => {
      restart();
    });

    socket?.on("opponent_joined", () => {
      setHasOpponent(true);
    });
  }, [myTurn, socket]);

  useEffect(() => {
    if (
      room &&
      !!opponents?.length &&
      !!user?.data.username &&
      turnNumber === 0
    ) {
      // means you are player 1
      if (opponents[0] === user?.data.username) {
        setMyTurn(true);
      }
      // means you are player 2
      else {
        setPlayerType("opp");
        socket.emit("join", room);
        setMyTurn(false);
      }
    }
  }, [room, opponents, user]);

  return (
    <Flex justifyContent="center" alignItems="center">
      {questions && (
        <MenuWrapper style={{ width: "75rem" }}>
          <QuestionSection />
          <GameBoard />
        </MenuWrapper>
      )}
      <Pawns />
    </Flex>
  );
};

export default GameStart;
