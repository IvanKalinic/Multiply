import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useSocket } from "../../context/SocketContext";
import { TicTacToeBox } from "../../components";
import { winningCombinations } from "../../consts/ticTacToe";
import { Flex } from "@chakra-ui/react";
import { TicTacToeContainer } from "../modules.style";
import { useTicTacToe } from "../../context/TicTacToeContext";
import { useUser } from "../../context/UserContext";
import axios from "axios";

const TicTacToePage = () => {
  const [game, setGame] = useState(Array(9).fill(""));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [xo, setXO] = useState("X");
  const [player, setPlayer] = useState("");
  const [hasOpponent, setHasOpponent] = useState(false);
  const [share, setShare] = useState(false);
  const [room, setRoom] = useState<string>("");

  const { socket } = useSocket();
  const { opponents } = useTicTacToe();
  const { user } = useUser();
  const [turnData, setTurnData] = useState<boolean>(false);

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;

  const sendTurn = (index: number) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit("reqTurn", JSON.stringify({ index, value: xo, room }));
    }
  };

  const sendRestart = () => {
    socket.emit("reqRestart", JSON.stringify({ room }));
  };

  const restart = () => {
    setGame(Array(9).fill(""));
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  useEffect(() => {
    winningCombinations.forEach((c) => {
      if (
        game[c[0]] === game[c[1]] &&
        game[c[0]] === game[c[2]] &&
        game[c[0]] !== ""
      ) {
        setWinner(true);
      }
    });

    if (turnNumber === 0) {
      setMyTurn(xo === "X" ? true : false);
    }
  }, [game, turnNumber, xo]);

  useEffect(() => {
    socket.on("playerTurn", (json: boolean) => {
      setTurnData(json);
    });

    socket.on("restart", () => {
      restart();
    });

    socket.on("opponent_joined", () => {
      setHasOpponent(true);
      setShare(false);
    });
  }, []);

  useEffect(() => {
    console.log(turnData);
    if (turnData) {
      const data = parseInt(turnData.toString());
      console.log(data);
      let g = [...game];
      if (!g[data] && !winner) {
        g[data] = data;
        setGame(g);
        setTurnNumber(turnNumber + 1);
        setTurnData(false);
        setMyTurn(!myTurn);
        setPlayer(data.toString());
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn]);

  useEffect(() => {
    console.log("line 90", room);
    // means you are player 1
    if (opponents[0] === user?.name) {
      setMyTurn(true);
    }
    // means you are player 2
    else {
      setXO("O");
      socket.emit("join", room);
      setMyTurn(false);
    }
  }, [room]);

  console.log(room);

  useEffect(() => {
    const fetchUser = (async () => {
      await axios.get(`${baseUrl}/game/`).then((res) => {
        console.log(res);
        setRoom(res.data.room);
      });
    })();
  }, []);

  return (
    <TicTacToeContainer>
      Room: {room}
      {/* <button className="btn" onClick={() => setShare((share) => !share)}>
        Share
      </button>
      {share ? (
        <>
          <br />
          <br />
          Share link:{" "}
          <input
            type="text"
            value={`${window.location.href}?room=${room}`}
            readOnly
          />
        </>
      ) : null} */}
      <br />
      <br />
      Turn: {myTurn ? "You" : "Opponent"}
      <br />
      {hasOpponent ? "" : "Waiting for opponent..."}
      <p>
        {winner || turnNumber === 9 ? (
          <button className="btn" onClick={sendRestart}>
            Restart
          </button>
        ) : null}
        {winner ? (
          <span>We have a winner: {player}</span>
        ) : turnNumber === 9 ? (
          <span>It's a tie!</span>
        ) : (
          <br />
        )}
      </p>
      <Flex>
        <TicTacToeBox index={0} turn={sendTurn} value={game[0]} />
        <TicTacToeBox index={1} turn={sendTurn} value={game[1]} />
        <TicTacToeBox index={2} turn={sendTurn} value={game[2]} />
      </Flex>
      <Flex>
        <TicTacToeBox index={3} turn={sendTurn} value={game[3]} />
        <TicTacToeBox index={4} turn={sendTurn} value={game[4]} />
        <TicTacToeBox index={5} turn={sendTurn} value={game[5]} />
      </Flex>
      <Flex>
        <TicTacToeBox index={6} turn={sendTurn} value={game[6]} />
        <TicTacToeBox index={7} turn={sendTurn} value={game[7]} />
        <TicTacToeBox index={8} turn={sendTurn} value={game[8]} />
      </Flex>
    </TicTacToeContainer>
  );
};

export default TicTacToePage;
