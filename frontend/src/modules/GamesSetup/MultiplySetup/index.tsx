import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { deleteActiveGames, fetchQuestions } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import Warning from "../../../components/Warning";
import { categories, difficulties, listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { useGame } from "../../../context/GameContext";
import { useSocket } from "../../../context/SocketContext";
import { MenuWrapper } from "../../../styles";
import { gameSetup } from "../../../utils";
import PairsItem from "./PairsItem";

const startValue = { category: "", difficulty: "", opponents: ["", ""] };

type SelectedOptions = {
  category: string;
  difficulty: string;
  opponents: Array<string>;

  opponentsClass?: string;
};

const MultiplySetup = ({ battle }: { battle?: boolean }) => {
  const { setQuestions } = useGame();
  const { admin } = useAdmin();
  const { socket } = useSocket();

  const navigate = useNavigate();
  const axios = useAxios();

  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOptions>(startValue);
  const [users, setUsers] = useState<Array<any>>([]);
  const [randomGeneratedUsers, setRandomGeneratedUsers] = useState<Array<any>>(
    []
  );
  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);
  const [oddUsersNumber, setOddUsersNumber] = useState<boolean>(false);

  const generateGame = async () => {
    await fetchQuestions(
      selectedOptions.category,
      selectedOptions.difficulty
    ).then((data) => {
      setQuestions(data.data);

      if (!!randomGeneratedUsers.length) {
        randomGeneratedUsers.map((pairs) => {
          gameSetup(
            navigate,
            battle ? "Battle" : "Multiply",
            selectedOptions.category,
            selectedOptions.difficulty,
            data.data,
            pairs,
            "",
            socket
          );
        });
      } else {
        gameSetup(
          navigate,
          battle ? "Battle" : "Multiply",
          selectedOptions.category,
          selectedOptions.difficulty,
          data.data,
          selectedOptions.opponents,
          "",
          socket
        );
      }
    });
  };

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

  const filterUsersBasedOnClass = (className: string) => {
    return users.filter((user) => user.class === className);
  };

  const splitAt = (index: number, array: Array<any>) => {
    var a = array.slice(0, index);
    var b = array.slice(index, array.length);
    return [a, b];
  };

  const shuffle = (array: Array<any>) => {
    return array.slice(0).sort(() => {
      return 0.5 - Math.random();
    });
  };

  const zip = (array: Array<any>) => {
    return array[0].map((_: any, i: number) => {
      return array.map((x) => {
        return x[i];
      });
    });
  };

  const generateRandomPairs = () => {
    const currentUsers = !!selectedOptions.opponentsClass?.length
      ? filterUsersBasedOnClass(selectedOptions.opponentsClass)
      : [];

    if (!!currentUsers.length) {
      setOddUsersNumber(currentUsers.length % 2 !== 0);
      setRandomGeneratedUsers(
        zip(splitAt(currentUsers.length / 2, shuffle(currentUsers))).map(
          (item: any) => item.map((user: any) => user.category)
        )
      );
    }

    setIsNewWindowOpen(true);
  };
  console.log(randomGeneratedUsers);

  // const handleOnDragEnd = () => {}
  return (
    <Flex justifyContent="center">
      {!!randomGeneratedUsers.length && isNewWindowOpen && (
        <MenuWrapper
          style={{ width: "20rem", position: "fixed", right: "5rem" }}
        >
          <CloseButton
            position="absolute"
            right="1rem"
            top="1.5rem"
            onClick={() => setIsNewWindowOpen(false)}
          />
          <Heading position="absolute" top="1rem" fontSize="xl">
            Random pairs <br /> for: {selectedOptions?.opponentsClass}
          </Heading>
          {/* <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="generatedUsers">
              {(provided) => ( */}
          <Flex
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            // {...provided.droppableProps}
            // ref={provided.innerRef}
          >
            {randomGeneratedUsers.map((item, index) => (
              // <Draggable key={item} draggableId={item} index={index}>
              //   {(provided) => (
              <PairsItem
                // {...provided.draggableProps}
                // {...provided.dragHandleProps}
                // ref={provided.innerRef}
                index={index}
                pairs={item}
                randomGeneratedUsers={randomGeneratedUsers}
              />
              // )}
              // </Draggable>
            ))}
            <Box mt="2rem">
              {oddUsersNumber && (
                <Warning
                  text={
                    <div>
                      Not all users are paired because <br /> of odd number of
                      users. Please add <br /> new user in order to pair all of
                      them.
                    </div>
                  }
                />
              )}
            </Box>
            {/* {provided.placeholder} */}
          </Flex>
          {/* )} */}
          {/* </Droppable>
          </DragDropContext> */}
        </MenuWrapper>
      )}
      <MenuWrapper style={{ width: "30rem", height: "25rem" }}>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="3xl" mt="0.5rem">
            Configure game
          </Text>
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
          <Flex alignItems="center" justifyContent="center">
            <Box mt="4" mr="4">
              <SelectDropdown
                message="Opponents class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponentsClass"
              />
            </Box>
            <Box mt="4" mr="4">
              <Button colorScheme="blue" h="3rem" onClick={generateRandomPairs}>
                Generate pairs
              </Button>
            </Box>
          </Flex>
          <Flex>
            <Box mt="4" mr="4">
              <SelectDropdown
                message={
                  !!selectedOptions?.opponentsClass &&
                  !filterUsersBasedOnClass(selectedOptions?.opponentsClass)
                    .length
                    ? "Empty class"
                    : "1st opponent"
                }
                array={
                  !!selectedOptions?.opponentsClass
                    ? filterUsersBasedOnClass(selectedOptions?.opponentsClass)
                    : users
                }
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponents"
              />
            </Box>
            <Box mt="4">
              <SelectDropdown
                message={
                  !!selectedOptions?.opponentsClass &&
                  !filterUsersBasedOnClass(selectedOptions?.opponentsClass)
                    .length
                    ? "Empty class"
                    : "2nd opponent"
                }
                array={
                  !!selectedOptions?.opponentsClass
                    ? filterUsersBasedOnClass(selectedOptions?.opponentsClass)
                    : users
                }
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
