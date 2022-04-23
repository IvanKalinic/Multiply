import { Box, Button, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import { categories, difficulties } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useGame } from "../../../context/GameContext";
import { MenuWrapper } from "../../../styles";

const startValue = { category: "", difficulty: "", opponents: ["", ""] };

type SelectedOptions = {
  category: string;
  difficulty: string;
  opponents: Array<string>;
};

const MultiplySetup = () => {
  const { setQuestions } = useGame();
  const { admin } = useAdmin();
  const navigate = useNavigate();

  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOptions>(startValue);
  const [users, setUsers] = useState<Array<{}>>([]);

  const generateGame = async () => {
    await fetchQuestions(
      selectedOptions.category,
      selectedOptions.difficulty
    ).then((data) => setQuestions(data.data));
    navigate("/mulitplyGameStart");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      // set global axios instance
      await axios
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/users`)
        .then((data) => {
          const userValues = data.data.map((user: any) => {
            return { category: user.username, value: user._id };
          });
          setUsers(userValues);
        });
    };
    fetchUsers();
  }, [admin]);

  return (
    <Flex justifyContent="center">
      <MenuWrapper style={{ width: "30rem", height: "25rem" }}>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl">Configure game</Text>
          <Box mt="5">
            <SelectDropdown
              message="Select category"
              array={categories}
              setSelectedOptions={setSelectedOptions}
              selectedOptions={selectedOptions}
              selection="category"
            />
          </Box>
          <Box mt="4">
            <SelectDropdown
              message="Select difficulty"
              array={difficulties}
              setSelectedOptions={setSelectedOptions}
              selectedOptions={selectedOptions}
              selection="difficulty"
            />
          </Box>
          <Flex>
            <Box mt="4" mr="4">
              <SelectDropdown
                message=" 1st opponent"
                array={users}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponents"
              />
            </Box>
            <Box mt="4">
              <SelectDropdown
                message="2nd opponent"
                array={users}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponents"
              />
            </Box>
          </Flex>
          <Button
            colorScheme="teal"
            size="lg"
            mt="10"
            mb="5"
            w={400}
            onClick={generateGame}
          >
            Start game
          </Button>
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default MultiplySetup;