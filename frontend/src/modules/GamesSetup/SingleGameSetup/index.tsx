import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteActiveGames } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import Warning from "../../../components/Warning";
import { categories, difficulties, listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { MenuWrapper } from "../../../styles";
import { gameSetup } from "../../../utils";
import { getSign } from "../../Games/MemoryGame";
import CustomizeItem from "./CustomizeItem";

type SelectedOpponents = {
  user: string;
  room: string;
  userClass?: string;
  difficulty?: string;
  category?: string;
};

const startValue = { user: "", room: "", difficulty: "", category: "" };

const MemorySetup = ({ name }: { name: string }) => {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const axios = useAxios();

  const [warning, setWarning] = useState<boolean>(false);
  const [customArrayWarning, setCustomArrayWarning] = useState<boolean>(false);
  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);
  const customArray = Array(8).fill({
    question: "",
    correctAnswer: 0,
    firstOperand: 0,
    secondOperand: 0,
    difficulty: "",
    category: "",
  });

  const [customOperator, setCustomOperator] = useState("");

  const [users, setUsers] = useState<Array<any>>([]);
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOpponents>(startValue);

  useEffect(() => {
    const fetchUsers = (async () => {
      await axios.get(`/users`).then((data) => {
        const userValues = data.data.map((user: any) => {
          return {
            category: user.username,
            value: user._id,
            class: user.class,
          };
        });
        setUsers(userValues);
      });
    })();
    //deleting active game before new one is setup
    deleteActiveGames();
  }, [admin]);

  const generateGame = async () => {
    if (!selectedOptions.user) {
      setWarning(true);
      return;
    }
    if (isNewWindowOpen && !customArray.every((item) => !!item.question)) {
      // ako nije potpuno
      setCustomArrayWarning(true);
      return;
    }

    gameSetup(
      navigate,
      name === "memory" ? "Memory game" : "Hangman",
      selectedOptions?.category ?? "",
      !isNewWindowOpen ? selectedOptions?.difficulty ?? "" : "Customize",
      !isNewWindowOpen ? [] : customArray,
      [],
      selectedOptions.user
    );
  };

  const filterUsersBasedOnClass = (className: string) => {
    return users.filter((user) => user.class === className);
  };

  useEffect(() => {
    if (!!selectedOptions.user && warning) {
      setWarning(false);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (isNewWindowOpen && !!selectedOptions.category) {
      let category = getSign(selectedOptions.category);
      if (category) setCustomOperator(category);
    }
  }, [selectedOptions, isNewWindowOpen]);

  const handleOpen = () => {
    setIsNewWindowOpen(true);
  };

  const handleConfirm = useCallback(() => {
    console.log(customArray);
  }, [customArray]);

  console.log(customArray);
  return (
    <Flex justifyContent="center">
      {name === "memory" && isNewWindowOpen && (
        <MenuWrapper
          style={{ width: "20rem", position: "fixed", right: "5rem" }}
        >
          <CloseButton
            position="absolute"
            right="1rem"
            top="1.5rem"
            onClick={() => setIsNewWindowOpen(false)}
          />
          <Heading position="absolute" top="1rem">
            {selectedOptions?.category}
          </Heading>
          <Flex
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            {customArray.map((item, index) => (
              <CustomizeItem
                key={index}
                index={index}
                customArray={customArray}
                category={selectedOptions?.category ?? ""}
                customOperator={customOperator}
              />
            ))}
            <Button colorScheme="blue" mt="1rem" onClick={handleConfirm}>
              Confirm
            </Button>
          </Flex>
        </MenuWrapper>
      )}
      <MenuWrapper>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            mr="4"
            mb="2rem"
            w={300}
            fontSize="1.3rem"
            onClick={handleOpen}
          >
            {name === "memory" ? "Add your pairs" : "Add new word"}
          </Button>
          {name === "memory" && (
            <Flex justify="center" flexDirection="column">
              <Box mt="4">
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
            </Flex>
          )}
          <Flex>
            <Box mt="4" mr="4">
              <SelectDropdown
                message="User's class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="userClass"
              />
            </Box>
            <Box mt="4" mr="4">
              <SelectDropdown
                message={
                  !!selectedOptions?.userClass &&
                  !filterUsersBasedOnClass(selectedOptions?.userClass).length
                    ? "Empty class"
                    : "User"
                }
                array={
                  !!selectedOptions?.userClass
                    ? filterUsersBasedOnClass(selectedOptions?.userClass)
                    : users
                }
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="user"
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
          {warning && <Warning text="You must select user" />}
          {customArrayWarning && (
            <Warning text="You must enter a total of 8 pairs" />
          )}
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default MemorySetup;
