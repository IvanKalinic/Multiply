import axios from "axios";

export const fetchQuestions = async (category: string, difficulty: string) => {
  return await axios.get(
    `${process.env.REACT_APP_SERVER_BASE_URL}/questions/${category}/${difficulty}`
  );
};
