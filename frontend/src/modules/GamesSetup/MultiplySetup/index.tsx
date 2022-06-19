import {
  Box,
  Button,
  CloseButton,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteActiveGames,
  fetchAllUsers,
  fetchQuestions,
} from "../../../apis";
import SelectDropdown from "../../../components/Select";
import Warning from "../../../components/Warning";
import { categories, difficulties, listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { useGame } from "../../../context/GameContext";
import { useSocket } from "../../../context/SocketContext";
import { MenuWrapper } from "../../../styles";
import {
  gameSetup,
  normalBestPlayerSort,
  shuffle,
  splitAt,
  zip,
} from "../../../utils";
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
  const [bestPlayers, setBestPlayers] = useState<Array<any>>([]);
  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);
  const [oddUsersNumber, setOddUsersNumber] = useState<boolean>(false);
  const [arePairsGenerated, setArePairsGenerated] = useState<boolean>(false);
  const [previousSelection, setPreviousSelection] = useState<Array<any>>([]);

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
            pairs.map((pair: any) => pair.username),
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

  const generateRandomPairs = () => {
    const currentUsers = !!selectedOptions.opponentsClass?.length
      ? filterUsersBasedOnClass(selectedOptions.opponentsClass)
      : [];

    if (!!currentUsers.length) {
      setOddUsersNumber(currentUsers.length % 2 !== 0);
      fetchAllUsers().then((res) => {
        setBestPlayers(normalBestPlayerSort(res.data));
      });
      setRandomGeneratedUsers(
        zip(splitAt(currentUsers.length / 2, shuffle(currentUsers))).map(
          (item: any) => item.map((user: any) => user.category)
        )
      );
    }

    setIsNewWindowOpen(true);
  };

  useEffect(() => {
    if (!!randomGeneratedUsers.length && !!bestPlayers.length) {
      setRandomGeneratedUsers(
        randomGeneratedUsers.map((users) =>
          users.map((user: any) => ({
            username: user,
            rank:
              bestPlayers.findIndex(
                (player: any) => player?.username === user
              ) + 1,
          }))
        )
      );
    }
  }, [bestPlayers]);

  const generatePairsByLevel = () => {
    if (arePairsGenerated) {
      setRandomGeneratedUsers(previousSelection);
      setArePairsGenerated(false);
      return;
    }

    let bestUsersSort: Array<any> = [];
    try {
      if (!!randomGeneratedUsers.length) {
        setPreviousSelection(randomGeneratedUsers);
        bestUsersSort = [
          ...randomGeneratedUsers[0],
          ...randomGeneratedUsers[1],
        ].sort((user1, user2) => {
          return user1?.rank - user2?.rank;
        });
      }

      setRandomGeneratedUsers(
        bestUsersSort
          .map((user: any, i: number) => {
            if (2 * i < bestUsersSort.length)
              return [bestUsersSort[2 * i], bestUsersSort[2 * i + 1]];
          })
          .filter((array: any) => !!array?.length)
      );

      setArePairsGenerated(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex justifyContent="center">
      {!!randomGeneratedUsers.length && isNewWindowOpen && (
        <MenuWrapper
          style={{ width: "25rem", position: "fixed", right: "5rem" }}
        >
          <CloseButton
            position="absolute"
            right="1rem"
            top="1.5rem"
            onClick={() => setIsNewWindowOpen(false)}
          />
          <Heading position="absolute" top="1.8rem" fontSize="xl">
            Pairs for: {selectedOptions?.opponentsClass}
          </Heading>
          <Flex flexDirection="column" alignItems="center">
            <Button
              colorScheme="blue"
              w="90%"
              h="3rem"
              mb="2rem"
              onClick={generatePairsByLevel}
            >
              {!arePairsGenerated
                ? "Pair users by rank"
                : "Return previous selection"}
            </Button>
            <Flex
              justifyContent="center"
              flexDirection="column"
              alignItems="center"
            >
              {randomGeneratedUsers?.map((item, index) => (
                <PairsItem key={index} pairs={item} />
              ))}
              <Box mt="2rem">
                {oddUsersNumber && (
                  <Warning
                    text={
                      <>
                        Not all users are paired because <br /> of odd number of
                        users. Please add <br /> new user in order to pair all
                        of them.
                      </>
                    }
                  />
                )}
                {oddUsersNumber && (
                  <Link to="/addNewUser">
                    <Button mt="3rem" w="90%" h="3rem">
                      Add new users here
                    </Button>
                  </Link>
                )}
              </Box>
            </Flex>
          </Flex>
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
          <Flex>
            <Box mt="4" ml="1rem" w="10rem">
              <SelectDropdown
                message="Opp. class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponentsClass"
              />
            </Box>
            <Box mt="4" mr="4" ml="1rem">
              <Button
                colorScheme="blue"
                h="3rem"
                w="10.3rem"
                onClick={generateRandomPairs}
              >
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
