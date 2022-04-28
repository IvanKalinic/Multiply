import { Box, Button, Flex } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteActiveGameIfThereIsAWinner } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { useSocket } from "../../../context/SocketContext";
import { useTicTacToe } from "../../../context/TicTacToeContext";
import { MenuWrapper } from "../../../styles";
import { randomRoomName } from "../../../utils";

type SelectedOpponents = {
  opponents: Array<string>;
  room: string;
};

const startValue = { opponents: ["", ""], room: "" };

const TicTacToeSetup = () => {
  const { setOpponents } = useTicTacToe();
  const { admin } = useAdmin();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const axios = useAxios();

  const [users, setUsers] = useState<Array<any>>([]);
  const [selectedOptions, setSelectedOptions] =
    useState<SelectedOpponents>(startValue);

  useEffect(() => {
    const fetchUsers = (async () => {
      // set global axios instance
      await axios.get(`/users`).then((data) => {
        const userValues = data.data.map((user: any) => {
          return { category: user.username, value: user._id };
        });
        setUsers(userValues);
      });
    })();
    //deleting active game before new one is setup
    deleteActiveGameIfThereIsAWinner();
  }, [admin]);

  const generateGame = async () => {
    let room = randomRoomName();
    setOpponents(selectedOptions.opponents);
    try {
      await axios.post(`/game/save`, {
        opponents: selectedOptions.opponents,
        type: 2,
        room,
      });
      socket.emit("create", room);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex justifyContent="center">
      <MenuWrapper>
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
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

export default TicTacToeSetup;
