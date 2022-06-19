import { Box, Button, CloseButton, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteActiveGames, fetchAllUsers } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import Warning from "../../../components/Warning";
import { listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { useOpponents } from "../../../context/OpponentsContext";
import { useSocket } from "../../../context/SocketContext";
import { MenuWrapper } from "../../../styles";
import {
  gameSetup,
  normalBestPlayerSort,
  shuffle,
  splitAt,
  zip,
} from "../../../utils";
import PairsItem from "../MultiplySetup/PairsItem";

type SelectedOpponents = {
  opponents: Array<string>;
  room: string;
  opponentsClass?: string;
};

const startValue = { opponents: ["", ""], room: "" };

const TicTacToeSetup = () => {
  const { setOpponents } = useOpponents();
  const { admin } = useAdmin();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const axios = useAxios();

  const [users, setUsers] = useState<Array<any>>([]);
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOpponents>(startValue);

  const [randomGeneratedUsers, setRandomGeneratedUsers] = useState<Array<any>>(
    []
  );
  const [isNewWindowOpen, setIsNewWindowOpen] = useState<boolean>(false);
  const [oddUsersNumber, setOddUsersNumber] = useState<boolean>(false);
  const [bestPlayers, setBestPlayers] = useState<Array<any>>([]);

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
    if (!!randomGeneratedUsers.length) {
      randomGeneratedUsers.map((pairs) => {
        gameSetup(
          navigate,
          "TicTacToe",
          "",
          "",
          [],
          pairs.map((pair: any) => pair.username),
          "",
          socket
        );
      });
    } else {
      setOpponents(selectedOptions.opponents);
      gameSetup(
        navigate,
        "TicTacToe",
        "",
        "",
        [],
        selectedOptions.opponents,
        "",
        socket
      );
    }
  };

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
      <MenuWrapper>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* listOfClasses */}
          <Box mt="4" mr="0">
            <Button
              colorScheme="blue"
              h="3rem"
              w="10.3rem"
              onClick={generateRandomPairs}
            >
              Generate pairs
            </Button>
          </Box>
          <Flex>
            <Box mt="4" mr="0" w="21rem">
              <SelectDropdown
                message="Opponents class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="opponentsClass"
              />
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

export default TicTacToeSetup;
