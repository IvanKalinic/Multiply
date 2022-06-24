import { saveActiveGame } from "../apis";

export const vertical = (boardArray: any) => {
  let column;
  for (let i = 0; i < 8; i++) {
    column = boardArray[i];
    for (let j = 0; j < 8 - 3; j++) {
      if (
        column[j] !== null &&
        column[j].clicked &&
        column[j + 1].clicked &&
        column[j + 2].clicked &&
        column[j + 3].clicked &&
        column[j]?.color === column[j + 1]?.color &&
        column[j + 1]?.color === column[j + 2]?.color &&
        column[j + 2]?.color === column[j + 3]?.color
      ) {
        return true;
      }
    }
  }
};

export const horizontal = (boardArray: any) => {
  for (let i = 0; i < 8 - 3; i++) {
    for (let j = 0; j < 8; j++) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j].clicked &&
        boardArray[i + 2][j].clicked &&
        boardArray[i + 3][j].clicked &&
        boardArray[i][j]?.color === boardArray[i + 1][j]?.color &&
        boardArray[i + 1][j]?.color === boardArray[i + 2][j]?.color &&
        boardArray[i + 2][j]?.color === boardArray[i + 3][j]?.color
      ) {
        return true;
      }
    }
  }
};

export const diagonalUp = (boardArray: any) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j + 1].clicked &&
        boardArray[i + 2][j + 2].clicked &&
        boardArray[i + 3][j + 3].clicked &&
        boardArray[i][j]?.color === boardArray[i + 1][j + 1]?.color &&
        boardArray[i + 1][j + 1]?.color === boardArray[i + 2][j + 2]?.color &&
        boardArray[i + 2][j + 2]?.color === boardArray[i + 3][j + 3]?.color
      ) {
        return true;
      }
    }
  }
};

export const diagonalDown = (boardArray: any) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 7; j >= 3; j--) {
      if (
        boardArray[i][j] !== null &&
        boardArray[i][j].clicked &&
        boardArray[i + 1][j - 1].clicked &&
        boardArray[i + 2][j - 2].clicked &&
        boardArray[i + 3][j - 3].clicked &&
        boardArray[i][j]?.color === boardArray[i + 1][j - 1]?.color &&
        boardArray[i + 1][j - 1]?.color === boardArray[i + 2][j - 2]?.color &&
        boardArray[i + 2][j - 2]?.color === boardArray[i + 3][j - 3]?.color
      ) {
        return true;
      }
    }
  }
};

export const handleShuffle = (options: any) => {
  return options.sort(() => Math.random() - 0.5);
};

export const randomRoomName = () => {
  return Array.from(Array(8), () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
};

export const gameType = (gameName: string) => {
  switch (gameName) {
    case "Multiply":
      return 1;
    case "TicTacToe":
      return 2;
    case "Memory game":
      return 3;
    case "Hangman":
      return 4;
    default:
      return 0;
  }
};

export const gameSetup = async (
  navigate: any,
  game: string,
  category?: string,
  difficulty?: string,
  questions?: Array<any>,
  opponents?: Array<any>,
  user?: string,
  socket?: any,
  newWord?: string
) => {
  let room = !user ? randomRoomName() : null;

  const battleArray =
    game === "Battle"
      ? [
          { type: 2, winner: "" },
          {
            type: 3,
            winner: [],
          },
          {
            type: 4,
            winner: [],
          },
          { type: 1, winner: "" },
        ]
      : null;

  try {
    saveActiveGame({
      opponents: !!opponents?.length ? opponents : null,
      user: !!user ? user : null,
      type: game !== "Battle" ? gameType(game) : 5,
      room,
      category,
      difficulty,
      questions,
      battleArray,
      newWord: newWord ?? null,
    });
    if (!!socket) socket.emit("create", room);
    navigate("/");
  } catch (err) {
    console.log(err);
  }
};

export const randomValue = (array: Array<any>) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getGameName = (type: number) => {
  switch (type) {
    case 1:
      return "TicTacToe";
    case 2:
      return "Multiply";
    case 3:
      return "Memory";
    case 4:
      return "Hangman";
  }
};

export const checkLevel = (points: number) => {
  if (points >= 0 && points < 10) return 1;
  if (points >= 10 && points < 20) return 2;
  if (points >= 20 && points < 35) return 3;
  if (points >= 35 && points < 50) return 4;
  if (points >= 50 && points < 75) return 5;
  if (points >= 75 && points < 110) return 6;
  if (points >= 110 && points < 150) return 7;
  if (points >= 150 && points < 195) return 8;
  if (points >= 195 && points < 245) return 9;
  if (points >= 245 && points <= 300) return 10;
};

export const getLevelUpperBound = (levelNumber: number) => {
  switch (levelNumber) {
    case 0:
      return 0;
    case 1:
      return 10;
    case 2:
      return 20;
    case 3:
      return 35;
    case 4:
      return 50;
    case 5:
      return 75;
    case 6:
      return 110;
    case 7:
      return 150;
    case 8:
      return 195;
    case 9:
      return 245;
    case 10:
      return 300;
    default:
      return 10;
  }
};

export const levelNameFromScore = (points: number) => {
  if (points >= 0 && points < 50) return "Beginner";
  if (points >= 50 && points < 150) return "Medium";
  if (points >= 150 && points <= 300) return "Pro";
};

export const normalBestPlayerSort = (bestPlayers: Array<any>) => {
  return bestPlayers.sort(
    (user1, user2) => user2.overallPoints - user1.overallPoints
  );
};

export const bestPlayerSort = (bestPlayers: Array<any>) => {
  return bestPlayers
    .sort((user1, user2) => user2.overallPoints - user1.overallPoints)
    .slice(0, 10);
};

export const arraySortSpeed = (fastestArray: Array<any>) => {
  return fastestArray !== null
    ? fastestArray
        .sort((user1, user2) => {
          return (
            user1?.speed / user1?.gamesPlayed?.length -
            user2?.speed / user2?.gamesPlayed?.length
          );
        })
        .slice(0, 10)
    : [];
};

export const bestInGame = (bestGameArray: Array<any>) => {
  const arrayWithUserNames = bestGameArray.map((row) => row.winner);

  //number of appearances of every pupil
  let reducedArray = arrayWithUserNames.reduce((p, c) => {
    p[c] = (p[c] || 0) + 1;
    return p;
  }, []);

  // i.e. ["user13","user14","user16"]
  let newArray = Object.keys(reducedArray).sort((a, b) => {
    return reducedArray[b] - reducedArray[a];
  });

  return newArray.map((key) => ({
    name: key,
    wins: reducedArray[key],
  }));
};

export const checkBattleArrayWinner = (
  battleArray: any,
  multiplyWinner: string,
  user: any
) => {
  let userPoints = 0;
  let maxPoints = 0;
  battleArray.map((item: any, index: number) => {
    if (item.type === 2 || item.type === 1) {
      maxPoints = maxPoints + index + 1;
      if (item.winner === user.data.username) {
        userPoints = userPoints + index + 1;
      }
    }
    if (item.type === 3 || item.type === 4) {
      let winNumber = item.winner.filter(
        (item: any) => item.win === true
      ).length;
      if (!!winNumber) maxPoints = maxPoints + winNumber * (index + 1);
      if (
        !!item.winner.find(
          (winner: any) =>
            winner.name === user.data.username && winner.win === true
        )
      ) {
        userPoints = userPoints + index + 1;
      }
    }
    if (item.type === 1) {
      // nije se još updatea pa dodaj odma bodove od ove igre
      if (!item.winner) {
        if (multiplyWinner === user.data.username) {
          userPoints = userPoints + 4;
        }
      }
    }
  });

  return (
    userPoints > maxPoints / 2 ||
    (userPoints === maxPoints / 2 && multiplyWinner === user.data.username)
  );
};

export const splitAt = (index: number, array: Array<any>) => {
  var a = array.slice(0, index);
  var b = array.slice(index, array.length);
  return [a, b];
};

export const shuffle = (array: Array<any>) => {
  return array.slice(0).sort(() => {
    return 0.5 - Math.random();
  });
};

export const zip = (array: Array<any>) => {
  return array[0].map((_: any, i: number) => {
    return array.map((x) => {
      return x[i];
    });
  });
};
