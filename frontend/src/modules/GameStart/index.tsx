import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchQuestions, getActiveGame } from "../../apis";
import Pawns from "../../components/Pawns";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { useAxios } from "../../context/AxiosContext";
import { useGame } from "../../context/GameContext";
import { useSocket } from "../../context/SocketContext";
import { useTurnBased } from "../../context/TurnBasedContext";
import { useUser } from "../../context/UserContext";
import { MenuWrapper } from "../../styles";
import { homeColor, awayColor } from "../../consts";
import { CircularBar } from "../../components/CircularProgressbar";

const GameStart = () => {
  const { questions, setQuestions, setDisplayWin } = useGame();
  const { user, setUser } = useUser();
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
    hasOpponent,
    setHasOpponent,
    turnNumber,
    setTurnNumber,
    game,
    setGame,
  } = useTurnBased();

  const [category, setCategory] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [opponentArray, setOpponentArray] = useState<Array<any>>([]);
  const [questionFromOpponent, setQuestionFromOpponent] = useState<number>(0);

  const restart = () => {
    setGame([]);
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  const fetchGameDetails = async (hasOpponent: boolean) => {
    await axios.get(`/game`).then((res) => {
      setRoom(res?.data[0]?.room);
      setOpponents(res?.data[0]?.opponents);
      setCategory(res?.data[0]?.category);
      setDifficulty(res?.data[0]?.difficulty);
      if (hasOpponent) {
        setOpponentArray(res?.data[0]?.gameBoard);
        setQuestions(res?.data[0]?.questions);
      }
    });
  };

  useEffect(() => {
    fetchGameDetails(hasOpponent);
  }, [hasOpponent]);

  useEffect(() => {
    const fetchGameQuestions = (async () => {
      if (category && difficulty) {
        await fetchQuestions(category, difficulty).then((data) =>
          setQuestions(data.data)
        );
      }
    })();
  }, [category, difficulty]);

  useEffect(() => {
    socket?.on("playerTurn", (json: any) => {
      if (!turnNumber) setHasOpponent(true);
      console.log("Player turn");
      console.log(json);

      if (!myTurn) setMyTurn(true);
      if (Object.keys(json).every((val) => !json[val].length)) return;

      if (!!json.game.length) {
        setGame(json.game);
        setOpponentArray(json.game);
      }
      if (json.value) setPlayer(json.value);
      if (json.question) setQuestionFromOpponent(json.question);
      if (json.winner) {
        setDisplayWin(true);
        setPlayer(json.winner);
      }
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
        if (!user?.color) setUser({ ...user, color: homeColor });
      }
      // means you are player 2
      else {
        setPlayerType("opp");
        socket.emit("join", room);
        setMyTurn(false);
        if (!user?.color) setUser({ ...user, color: awayColor });

        getActiveGame().then((data) => {
          if (data.data?.questions) setQuestions(data.data?.questions);
          if (data.data?.gameBoard) setOpponentArray(data.data?.gameBoard);
        });
      }
    }
  }, [room, opponents, user]);

  return (
    <>
      <Heading position="absolute" fontSize="md" top="2">
        Turn: {myTurn ? "You" : "Opponent"}
      </Heading>
      <Flex justifyContent="center" alignItems="center">
        {questions && (
          <MenuWrapper style={{ width: "75rem" }}>
            <QuestionSection
              currentQuestionFromOpponent={questionFromOpponent}
            />
            <GameBoard opponentArray={opponentArray} />
            <CircularBar />
          </MenuWrapper>
        )}
        <Pawns />
      </Flex>
    </>
  );
};

export default GameStart;
