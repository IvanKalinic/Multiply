import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Flex, Box, Button, Text } from "@chakra-ui/react";
import MathPicture from "../../assets/images/math.png";
import { MenuWrapper, SelectionWrapper } from "../../styles";
import SelectDropdown from "../../components/Select";
import { categories, difficulties } from "../../consts";
import { useAdmin } from "../../context/AdminContext";
import axios from "axios";

type SelectedOptions = {
  category: string;
  difficulty: string;
  opponents: Array<string>;
};
const startValue = { category: "", difficulty: "", opponents: ["", ""] };

const AdminAppPage = () => {
  const { admin } = useAdmin();
  const [users, setUsers] = useState<Array<{}>>([]);
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOptions>(startValue);

  useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get(`${process.env.REACT_APP_SERVER_BASE_URL}/users`)
        .then((data) => {
          const userValues = data.data.map((user) => {
            return { category: user.username, value: user._id };
          });
          setUsers(userValues);
        });
    };
    fetchUsers();
  }, [admin]);

  console.log(selectedOptions);

  return (
    <Flex
      justifyContent="center"
      style={{
        height: "calc(100vh - 50px)",
        backgroundImage: `url(${MathPicture})`,
        backgroundSize: "300px 300px",
      }}
    >
      <MenuWrapper>
        <Flex
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text fontSize="5xl" color="black" mb="2">
            Hello teacher {admin.data.username} !
          </Text>
          <Flex mb="4">
            <Text fontSize="2xl" color="white" mr="4">
              Add new user to game
            </Text>
            <Button w={200}>
              <Link to="/addNewUser">Add</Link>
            </Button>
          </Flex>
          <SelectionWrapper>
            <Text fontSize="3xl">Configure game</Text>
            <Box mt="10">
              <SelectDropdown
                message="Please select category for quiz"
                array={categories}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="category"
              />
            </Box>
            <Box mt="4">
              <SelectDropdown
                message="Please select difficulty for quiz"
                array={difficulties}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="difficulty"
              />
            </Box>
            <Text mt="4" fontSize="3xl" color="white">
              Please select competitive students
            </Text>
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
            <Button colorScheme="teal" size="lg" mt="10" mb="10" w={400}>
              Start game
            </Button>
          </SelectionWrapper>
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default AdminAppPage;
