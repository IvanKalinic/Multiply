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

export const getActiveGame = async () => {
  return await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/game`);
};

export const deleteActiveGame = async () => {
  await axios.delete(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/deleteActiveGame`
  );
};

export const deleteActiveGameIfThereIsAWinner = async () => {
  getActiveGame().then((data) => {
    if (!!data.data[0]?.winner) {
      deleteActiveGame();
    }
  });
};

export const saveActiveGame = async (payload: any) => {
  await axios.post(
    `${process.env.REACT_APP_SERVER_BASE_URL}/game/save`,
    payload
  );
};
