import { Button, Flex, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
} from "../../apis";
import { TicTacToeBox } from "../../components";
import { winningCombinations } from "../../consts/ticTacToe";
import { useAxios } from "../../context/AxiosContext";
import { useSocket } from "../../context/SocketContext";
import { useUser } from "../../context/UserContext";
import { TicTacToeContainer } from "../modules.style";
import { v4 as uuidv4 } from "uuid";
import { checkLevel, levelNameFromScore } from "../../utils";

const TicTacToePage = () => {
  const [game, setGame] = useState(Array(9).fill(""));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [xo, setXO] = useState("X");
  const [hasOpponent, setHasOpponent] = useState(false);
  const [room, setRoom] = useState<string>("");
  const [opponents, setOpponents] = useState<Array<any>>();
  const [player, setPlayer] = useState<string>("");
  const [colorIndexes, setColorIndexes] = useState<Array<any>>([]);
  const [activeGame, setActiveGame] = useState<any>([]);

  const { socket } = useSocket();
  const { user } = useUser();
  const axios = useAxios();

  const sendTurn = (index: number) => {
    if (!game[index] && !winner && myTurn) {
      const g = [...game];
      g[index] = xo;
      setGame(g);
      setMyTurn((myTurn) => !myTurn);
      setTurnNumber((turnNumber) => turnNumber + 1);
      setPlayer(xo);
      socket.emit("reqTurn", { index, value: xo, room, g });
    }
  };

  const sendRestart = () => {
    restart();
    setMyTurn(true);
    socket.emit("reqRestart", room);
  };

  const restart = () => {
    setGame(Array(9).fill(""));
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
    setColorIndexes([]);
  };

  useEffect(() => {
    const fetchGameDetails = (async () => {
      await axios.get(`/game`).then((res) => {
        setActiveGame(res.data[0]);
        setRoom(res?.data[0]?.room);
        setOpponents(res?.data[0]?.opponents);
      });
    })();
  }, []);

  useEffect(() => {
    winningCombinations.forEach((c) => {
      if (
        game[c[0]] === game[c[1]] &&
        game[c[0]] === game[c[2]] &&
        game[c[0]] !== ""
      ) {
        setWinner(true);
        setColorIndexes([c[0], c[1], c[2]]);
      }
    });
  }, [game, turnNumber, xo]);

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
        setXO("O");
        socket.emit("join", room);
        setMyTurn(false);
      }
    }
  }, [room, opponents, user]);

  useEffect(() => {
    if (winner && player === xo)
      saveWinnerOrMultiplyDetails({
        opponents,
        room,
        type: 2,
        winner: user.data.username,
      });
    saveToGameHistory({
      opponents,
      room,
      gameName: "TicTacToe",
      winner: user.data.username,
      points: 1,
      speed: 0,
    });
    saveUserScore(user.data.username, {
      levelNumber: checkLevel(user.data?.overallPoints + 1),
      levelName: levelNameFromScore(user.data?.overallPoints + 1),
      game: {
        ...activeGame,
        opponents,
        room,
        type: 2,
        winner: user.data.username,
      },
    });
  }, [winner]);

  console.log(socket);

  return (
    <TicTacToeContainer>
      Room: {room}
      <br />
      <br />
      Turn: {myTurn ? "You" : "Opponent"}
      <br />
      {hasOpponent || xo === "O" ? "" : "Waiting for opponent..."}
      <Flex mb="2rem" flexDirection="column" alignItems="center">
        {winner || turnNumber === 9 ? (
          <Button onClick={sendRestart} mr="1rem" w="5rem">
            Restart
          </Button>
        ) : null}
        {winner ? (
          <span>We have a winner: {player === xo ? "You" : "Opponent"}</span>
        ) : turnNumber === 9 ? (
          <span>It's a tie!</span>
        ) : (
          <br />
        )}
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" gap={0}>
        {game.map((value, index) => (
          <TicTacToeBox
            key={uuidv4()}
            onClick={() => sendTurn(index)}
            value={value}
            color={
              index === colorIndexes[0] ||
              index === colorIndexes[1] ||
              index === colorIndexes[2]
            }
          />
        ))}
      </Grid>
    </TicTacToeContainer>
  );
};

export default TicTacToePage;
