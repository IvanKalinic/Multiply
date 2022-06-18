import { Button, Flex, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  deleteActiveGames,
  getActiveGame,
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../apis";
import ArrowRight from "../../assets/icons/arrow-right.png";
import { TicTacToeBox } from "../../components";
import { ArrowWrapper } from "../../components/sharedcomponents/Questions/QuestionItem/styles";
import { winningCombinations } from "../../consts/ticTacToe";
import { useAxios } from "../../context/AxiosContext";
import { useSocket } from "../../context/SocketContext";
import { useUser } from "../../context/UserContext";
import { MenuWrapper } from "../../styles";
import { checkLevel, levelNameFromScore } from "../../utils";
import { TicTacToeContainer } from "../modules.style";
interface Props {
  battle?: boolean;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
}

const TicTacToePage = ({ battle, setRerenderGame, setGameType }: Props) => {
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

  const nextGame = () => {
    setRerenderGame!(3);
    setMyTurn(true);
    socket.emit("nextGame");
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
        if (res.data.length > 1) {
          res.data.map((row: any) => {
            if (row?.user && row.user === user.data.username) {
              setActiveGame(row);
              setRoom(row.room);
            }
            if (
              !!row?.opponents?.length &&
              row.opponents.includes(user.data.username)
            ) {
              setActiveGame(row);
              setRoom(row.room);
              setOpponents(row.opponents);
            }
          });
        } else {
          setActiveGame(res.data[0]);
          setRoom(res?.data[0]?.room);
          setOpponents(res?.data[0]?.opponents);
        }
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

    socket?.on("nextGame", () => {
      setRerenderGame!(3);
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
    if (winner && player === xo) {
      if (battle) {
        updateBattleArrayInActiveGame(2, user.data.username);
      } else {
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
            opponents,
            room,
            type: 2,
            winner: user.data.username,
            points: 1,
          },
        });
      }
    }
  }, [winner]);

  console.log(winner);
  console.log(player === xo);

  const nextGameInQueue = () => {
    getActiveGame().then((data) => {
      let nextGame = data.data.find((game: any) => !game.winner)?.type;
      console.log(nextGame);
      if (!!nextGame) {
        setGameType!(6);
        deleteActiveGames();
        setRerenderGame!(nextGame);
      } else {
        setGameType!(0);
        setRerenderGame!(0);
      }
      if (nextGame === 2) restart();
    });
  };
  return (
    <TicTacToeContainer>
      {(winner || turnNumber === 9) && (
        <Button
          onClick={battle ? nextGame : nextGameInQueue}
          w="15rem"
          fontSize="md"
          top="-6vh"
          style={{ fontSize: "1.2rem" }}
        >
          Next game
          <ArrowWrapper
            src={ArrowRight}
            alt="arrow"
            style={{ width: "3rem", height: "3rem", marginLeft: "1rem" }}
          />
        </Button>
      )}
      <Button
        position="absolute"
        fontSize="md"
        mb={winner ? "25rem" : "27rem"}
        width="20rem"
        style={{ fontSize: "1.5rem" }}
      >
        {!winner && turnNumber !== 9 && (
          <span style={{ color: "rgb(157, 190, 245)" }}>Turn: </span>
        )}
        {winner && player === xo
          ? "You won"
          : winner && player !== xo
          ? "You lost"
          : !winner && turnNumber === 9
          ? "It's a tie!"
          : myTurn
          ? "You"
          : "Opponent"}
      </Button>

      <span style={{ marginTop: "0.5rem" }}>
        {hasOpponent || xo === "O" ? "" : "Waiting for opponent..."}
      </span>
      <Flex justifyContent="center">
        <MenuWrapper style={{ width: "30rem", height: "25rem" }}>
          <Grid templateColumns="repeat(3, 1fr)" gap={1}>
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
        </MenuWrapper>
      </Flex>
    </TicTacToeContainer>
  );
};

export default TicTacToePage;
