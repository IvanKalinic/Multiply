import { Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  fetchActiveGameBattleArray,
  fetchQuestions,
  getActiveGame,
  saveToGameHistory,
  saveUserScore,
  saveWinnerOrMultiplyDetails,
  updateBattleArrayInActiveGame,
} from "../../apis";
import { ChatLogo, VideoCall } from "../../assets/icons/svgs";
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
}

const GameStart = ({ battle, setRerenderGame }: Props) => {
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
  // const [ticked,setTicked] = useState<boolean>(false);
  const [battleWinner, setBattleWinner] = useState("");

  const restart = () => {
    setGame([]);
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  const fetchGameDetails = async (hasOpponent: boolean) => {
    if (battle) {
      fetchActiveGameBattleArray(user.data.username).then((res) => {
        setRoom(res.data.room);
        setOpponents(res?.data?.opponents);
        setCategory(res?.data?.category);
        setDifficulty(res?.data?.difficulty);
        if (hasOpponent) {
          // if (res?.data?.gameBoard && !opponentArray.length)
          setOpponentArray(res?.data?.gameBoard);
          // if (res?.data?.questions)
          setQuestions(res?.data?.questions);
        }
      });
    } else {
      await axios.get(`/game`).then((res) => {
        setRoom(res?.data[0]?.room);
        //FETCHAT SVE U KOJIMA JE USER U OPPONENTS ARRAYU, I DOK SE MAPIRA PROVJERIT JELI IGRA IMAGE WINNERA, AKO NEMA UZMI NULTU, AKO IMA UZMI PRVU SLJEDECU
        setOpponents(res?.data[0]?.opponents);
        setCategory(res?.data[0]?.category);
        setDifficulty(res?.data[0]?.difficulty);
        if (hasOpponent) {
          setOpponentArray(res?.data[0]?.gameBoard);
          setQuestions(res?.data[0]?.questions);
        }
      });
    }
  };

  useEffect(() => {
    fetchGameDetails(hasOpponent);
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
            console.log(
              checkBattleArrayWinner(res.data.battleArray, json.winner, user)
            );
            // saveToGameHistory({
            //   opponents,
            //   room,
            //   gameName: "Battle",
            //   winner: checkBattleArrayWinner(
            //     res.data.battleArray,
            //     json.winner,
            //     user
            //   )
            //     ? user.data.username
            //     : json.winner,
            //   points: 10,
            //   speed: 0,
            // })
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
      console.log(winner);
      setBattleWinner(winner);
    });

    socket?.on("restart", () => {
      restart();
    });

    socket?.on("opponent_joined", () => {
      setHasOpponent(true);
    });
  }, [myTurn]);

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
        socket.emit("join", room);
        setMyTurn(false);
        if (!user?.color) setUser({ ...user, color: awayColor });

        if (battle) {
          fetchActiveGameBattleArray(user.data.username).then((res) => {
            if (res.data?.questions) setQuestions(res.data?.questions);
            if (res.data?.gameBoard) setOpponentArray(res.data?.gameBoard);
          });
        } else {
          getActiveGame().then((data) => {
            if (data.data?.questions) setQuestions(data.data?.questions);
            if (data.data?.gameBoard) setOpponentArray(data.data?.gameBoard);
          });
        }
      }
    }
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
            />
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              position="fixed"
              left="3.1vw"
              top="12vh"
            >
              <VideoCall />
              <ChatLogo />
            </Flex>
            <CircularBar workSeconds={10} breakSeconds={0} />
          </MenuWrapper>
        )}
        <Pawns />
      </Flex>
    </>
  );
};

export default GameStart;
