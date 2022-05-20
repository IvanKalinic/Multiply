import axios from "axios";

export const fetchQuestions = async (category: string, difficulty: string) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_BASE_URL}/questions/${category}/${difficulty}`
  );
};

export const saveWinnerOrMultiplyDetails = async (activeGame: any) => {
  await axios.put(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/winnerOrMultiplyDetails`,
    activeGame
  );
};

export const saveToGameHistory = async (game: any) => {
  await axios.post(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/gameHistory`,
    game
  );
};

export const getActiveGame = async () => {
  return await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/game`);
};

export const deleteActiveGames = async () => {
  await axios.delete(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/deleteActiveGame`
  );
};

export const deleteActiveGameIfThereIsAWinner = async () => {
  getActiveGame().then((data) => {
    // if (!!data.data[0]?.winner) {
    deleteActiveGames(); // DELETION OF ALL GAMES THAT HAVE WINNER
    // }
  });
};

export const saveActiveGame = async (payload: any) => {
  await axios.post(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/save`,
    payload
  );
};

export const fetchUsersFromClassName = async (className: string) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_BASE_URL}/users/class/${className}`
  );
};

export const fetchGameScores = async (name: string) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/gameHistory/${name}`
  );
};

export const fetchAllUsers = async () => {
  return await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/users`);
};
export const fetchSpecificUser = async (username: string) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_BASE_URL}/users/username/${username}`
  );
};
interface PayloadType {
  overallPoints?:number;
  speed?:number;
  game?:any;
  levelNumber?:number;
  levelName?:string;
}
export const saveUserScore = async (username:string,payload: PayloadType) => {
  await axios.put(`${process.env.REACT_APP_SERVER_BASE_URL}/users/${username}`,payload)
}
//fastest - sort po speed-u
//top 10 - sort po overallPoints
