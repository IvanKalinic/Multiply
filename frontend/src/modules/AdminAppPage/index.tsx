import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { MenuWrapper } from "../../styles";
import SelectDropdown from "../../components/Select";
import { categories, difficulties } from "../../consts";
import { useAdmin } from "../../context/AdminContext";
import { fetchQuestions } from "../../apis";
import { useGame } from "../../context/GameContext";

type SelectedOptions = {
  category: string;
  difficulty: string;
  opponents: Array<string>;
};

const startValue = { category: "", difficulty: "", opponents: ["", ""] };

const AdminAppPage = () => {
  const { admin } = useAdmin();
  const { setQuestions } = useGame();
  const [users, setUsers] = useState<Array<{}>>([]);
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOptions>(startValue);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
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

  const generateGame = async () => {
    await fetchQuestions(
      selectedOptions.category,
      selectedOptions.difficulty
    ).then((data) => setQuestions(data.data));
    navigate("/gameStart");
  };

  return (
    <Flex justifyContent="center">
      <MenuWrapper>
        <Flex
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text fontSize="5xl" color="black" mb="2" as="abbr">
            Hello teacher {admin.data.username} !
          </Text>
          <Flex mb="4">
            <Button mr="4" w={300}>
              <Text fontSize="1.3rem">
                <Link to="/addNewUser">Add new users here</Link>
              </Text>
            </Button>
          </Flex>
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
      </MenuWrapper>
    </Flex>
  );
};

export default AdminAppPage;
