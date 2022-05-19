import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteActiveGameIfThereIsAWinner } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import { listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { useOpponents } from "../../../context/OpponentsContext";
import { useSocket } from "../../../context/SocketContext";
import { MenuWrapper } from "../../../styles";
import { gameSetup } from "../../../utils";

type SelectedOpponents = {
  opponents: Array<string>;
  room: string;
  firstOpponentsClass?: string;
  secondOpponentsClass?: string;
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
    deleteActiveGameIfThereIsAWinner();
  }, [admin]);

  const generateGame = async () => {
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
  };

  const filterUsersBasedOnClass = (className: string) => {
    return users.filter((user) => user.class === className);
  };

  console.log(selectedOptions);
  console.log(users);
  console.log(
    users.filter((user) => user.class === selectedOptions?.firstOpponentsClass)
  );
  return (
    <Flex justifyContent="center">
      <MenuWrapper>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* listOfClasses */}
          <Flex>
            <Box mt="4" mr="4">
              <SelectDropdown
                message=" 1st opponent's class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="firstOpponentsClass"
              />
            </Box>
            <Box mt="4">
              <SelectDropdown
                message="2nd opponent's class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="secondOpponentsClass"
              />
            </Box>
          </Flex>
          <Flex>
            <Box mt="4" mr="4">
              <SelectDropdown
                message={
                  !!selectedOptions?.firstOpponentsClass &&
                  !filterUsersBasedOnClass(selectedOptions?.firstOpponentsClass)
                    .length
                    ? "Empty class"
                    : "1st opponent"
                }
                array={
                  !!selectedOptions?.firstOpponentsClass
                    ? filterUsersBasedOnClass(
                        selectedOptions?.firstOpponentsClass
                      )
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
                  !!selectedOptions?.secondOpponentsClass &&
                  !filterUsersBasedOnClass(
                    selectedOptions?.secondOpponentsClass
                  ).length
                    ? "Empty class"
                    : "2nd opponent"
                }
                array={
                  !!selectedOptions?.secondOpponentsClass
                    ? filterUsersBasedOnClass(
                        selectedOptions?.secondOpponentsClass
                      )
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
