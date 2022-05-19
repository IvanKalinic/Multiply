import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteActiveGameIfThereIsAWinner } from "../../../apis";
import SelectDropdown from "../../../components/Select";
import Warning from "../../../components/Warning";
import { listOfClasses } from "../../../consts";
import { useAdmin } from "../../../context/AdminContext";
import { useAxios } from "../../../context/AxiosContext";
import { MenuWrapper } from "../../../styles";
import { gameSetup } from "../../../utils";

type SelectedOpponents = {
  user: string;
  room: string;
  userClass?: string;
};

const startValue = { user: "", room: "" };

const MemorySetup = ({ name }: { name: string }) => {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const axios = useAxios();

  const [warning, setWarning] = useState<boolean>(false);

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
    if (!selectedOptions.user) {
      setWarning(true);
      return;
    }

    gameSetup(
      navigate,
      name === "memory" ? "Memory game" : "Hangman",
      "",
      "",
      [],
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
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};

export default MemorySetup;
