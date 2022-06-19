import { Button, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  fetchActiveGameBattleArray,
  fetchQuestions,
  saveUserScore,
  updateBattleArrayInActiveGame,
} from "../../apis";
import { CircularBar } from "../../components/CircularProgressbar";
import Pawns from "../../components/Pawns";
import { GameBoard, QuestionSection } from "../../components/sharedcomponents";
import { awayColor, homeColor } from "../../consts";
import { useAxios } from "../../context/AxiosContext";
import { useGame } from "../../context/GameContext";
import { useSocket } from "../../context/SocketContext";
import { useTurnBased } from "../../context/TurnBasedContext";
import { useUser } from "../../context/UserContext";
import { MenuWrapper } from "../../styles";
import {
  checkBattleArrayWinner,
  checkLevel,
  levelNameFromScore,
} from "../../utils";

interface Props {
  battle?: boolean;
  setRerenderGame?: React.Dispatch<React.SetStateAction<number>>;
  setGameType?: React.Dispatch<React.SetStateAction<number>>;
}

const GameStart = ({ battle, setRerenderGame, setGameType }: Props) => {
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
  const [battleWinner, setBattleWinner] = useState("");

  const restart = () => {
    setGame([]);
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  const fetchGameDetails = async (hasOpponent: boolean) => {
    fetchActiveGameBattleArray(user.data.username).then((res) => {
      setRoom(res.data.room);
      setOpponents(res?.data?.opponents);
      setCategory(res?.data?.category);
      setDifficulty(res?.data?.difficulty);
      if (hasOpponent) {
        setOpponentArray(res?.data?.gameBoard);
        setQuestions(res?.data?.questions);
      }
    });
  };

  useEffect(() => {
    fetchGameDetails(hasOpponent);

    return () => {
      setOpponentArray([]);
      setQuestions([]);
    };
  }, [hasOpponent]);

  useEffect(() => {
    const fetchGameQuestions = (async () => {
      if (category && difficulty) {
        await fetchQuestions(category, difficulty).then((data) => {
          setQuestions(data.data);
          if (battle) {
            updateBattleArrayInActiveGame(
              1,
              user.data.username,
              null,
              data.data,
              false
            );
          }
        });
      }
    })();

    return () => {
      setQuestions([]);
    };
  }, [category, difficulty]);

  useEffect(() => {
    socket?.on("playerTurn", (json: any) => {
      if (!turnNumber) {
        setHasOpponent(true);
      }

      if (!myTurn) setMyTurn(true);
      if (Object.keys(json).every((val) => !json[val].length)) return;

      if (!!json.game.length) {
        setGame(json.game);
        console.log(json.game);
        setOpponentArray(json.game);
      }
      if (json.value) setPlayer(json.value);
      if (json.question) setQuestionFromOpponent(json.question);
      if (json.winner) {
        setDisplayWin(true);
        setPlayer(json.winner);

        if (battle) {
          updateBattleArrayInActiveGame(1, json.winner, [], [], true);
          fetchActiveGameBattleArray(user.data.username).then((res) => {
            saveUserScore(user.data.username, {
              levelNumber: checkLevel(
                user.data?.overallPoints +
                  checkBattleArrayWinner(
                    res.data.battleArray,
                    json.winner,
                    user
                  )
                  ? 10
                  : 0
              ),
              levelName: levelNameFromScore(
                user.data?.overallPoints +
                  checkBattleArrayWinner(
                    res.data.battleArray,
                    json.winner,
                    user
                  )
                  ? 10
                  : 0
              ),
              game,
              battle,
              battleWinner: checkBattleArrayWinner(
                res.data.battleArray,
                json.winner,
                user
              )
                ? user.data.username
                : json.winner,
              battlePoints: checkBattleArrayWinner(
                res.data.battleArray,
                json.winner,
                user
              )
                ? 10
                : 0,
            });
          });
          // setBattleWinner(json.winner);
          socket.emit("battleWinner", json.winner);
        }
      }
    });

    socket?.on("battleWinner", (winner: string) => {
      setBattleWinner(winner);
    });

    socket?.on("restart", () => {
      restart();
    });

    socket?.on("opponent_joined", (payload: any) => {
      if (!!opponents?.length && opponents.includes(payload.user))
        setHasOpponent(true);
    });
  }, [myTurn, opponents]);

  useEffect(() => {
    if (
      room &&
      !!opponents?.length &&
      !!user?.data.username &&
      turnNumber === 0 &&
      !hasOpponent
    ) {
      // means you are player 1
      if (opponents[0] === user?.data.username) {
        setMyTurn(true);
        if (!user?.color) setUser({ ...user, color: homeColor });
      }
      // means you are player 2
      else {
        setPlayerType("opp");
        socket.emit("join", { room, user: user.data.username });
        setMyTurn(false);
        if (!user?.color) setUser({ ...user, color: awayColor });

        fetchActiveGameBattleArray(user.data.username).then((res) => {
          if (res.data?.questions) setQuestions(res.data.questions);
          if (res.data?.gameBoard) setOpponentArray(res.data.gameBoard);
        });
      }
    }

    return () => {
      setQuestions([]);
      setOpponentArray([]);
    };
  }, [room, opponents, user]);

  return (
    <>
      <Button position="absolute" fontSize="md" top="1.5rem">
        <span style={{ color: "rgb(157, 190, 245)" }}>Turn: </span>
        {myTurn ? "You" : "Opponent"}
      </Button>
      <Flex justifyContent="center" alignItems="center">
        {questions && (
          <MenuWrapper style={{ width: "75vw", height: "80vh" }}>
            <QuestionSection
              currentQuestionFromOpponent={questionFromOpponent}
            />
            <GameBoard
              opponentArray={opponentArray}
              battle={battle}
              battleWinner={battleWinner}
              setGameType={setGameType}
              setRerenderGame={setRerenderGame}
            />
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              position="fixed"
              left="3.1vw"
              top="12vh"
            ></Flex>
            <CircularBar workSeconds={10} breakSeconds={0} />
          </MenuWrapper>
        )}
        <Pawns />
      </Flex>
    </>
  );
};

export default GameStart;
