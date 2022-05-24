import { Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  fetchAllUsers,
  fetchGameScores,
  fetchUsersFromClassName,
} from "../../apis";
import SelectDropdown from "../../components/Select";
import Stats from "../../components/Stats";
import { gameOptions, listOfClasses } from "../../consts";
import { MenuWrapper } from "../../styles";
import { arraySortSpeed, bestInGame, bestPlayerSort } from "../../utils";

const statisticsCategories = [
  {
    value: 1,
    category: "classes",
    options: listOfClasses,
  },
  { value: 2, category: "games", options: gameOptions },
  { value: 3, category: "Fastest", options: [] },
  { value: 4, category: "Top 10", options: [] },
];

type SelectedOptions = {
  classes: string;
  games: string;
  fastest: boolean;
  top10: boolean;
};

const Statistics = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [gameUsers, setGameUsers] = useState<Array<any>>([]);
  const [fastestUsers, setFastestUsers] = useState<Array<any>>([]);
  const [top10Users, setTop10Users] = useState<Array<any>>([]);

  const [displayArray, setDisplayArray] = useState<Array<any>>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    classes: "",
    games: "",
    fastest: false,
    top10: false,
  });

  const fetchCategory = (category: string) => {
    setSelectedOptions({
      ...selectedOptions,
      fastest: category === "Fastest" ? !!category : selectedOptions.fastest,
      top10: category === "Top 10" ? !!category : selectedOptions.top10,
    });
  };

  useEffect(() => {
    // if there is no selected options
    if (
      Object.keys(selectedOptions).every(
        (val) =>
          selectedOptions[val as keyof typeof selectedOptions] === false ||
          selectedOptions[val as keyof typeof selectedOptions] === ""
      )
    )
      return;

    //class is selected
    if (!selectedOptions.classes) displayArray[0] = null;
    if (!!selectedOptions.classes) {
      fetchUsersFromClassName(selectedOptions.classes).then((res) => {
        console.log(res);
        setUsers(bestPlayerSort(res.data));
        displayArray[0] = [...users];
      });
    }

    if (!selectedOptions.games) displayArray[1] = null;
    if (!!selectedOptions.games) {
      if (!selectedOptions.classes) {
        fetchGameScores(selectedOptions.games).then((res) => {
          console.log(res);
          setGameUsers(bestInGame(res.data));
          displayArray[1] = bestInGame(res.data);
        });
      }
    }
    if (selectedOptions.fastest) {
      if (!!selectedOptions.classes) {
        console.log(users);
        setFastestUsers(arraySortSpeed(users));
        console.log(users);
        displayArray[2] = arraySortSpeed(users);
        // setFastestUsers(res.data.map()) isto ko i u proslom
      } else {
        fetchAllUsers().then((res) => {
          setFastestUsers(arraySortSpeed(res.data));
          displayArray[2] = arraySortSpeed(res.data);
        });
      }
    }
    if (!!top10Users.length) displayArray[3] = top10Users;
    if (selectedOptions.top10) {
      fetchAllUsers().then((res) => {
        console.log(res.data);
        setTop10Users(bestPlayerSort(res.data));
        console.log(bestPlayerSort(res.data));
        displayArray[3] = bestPlayerSort(res.data);
      });
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (!!selectedOptions.classes) {
      fetchUsersFromClassName(selectedOptions.classes).then((res) => {
        let tempArray: Array<any> = [];

        if (!res.data.length) return;

        if (!selectedOptions.games) return;

        fetchGameScores(selectedOptions.games).then((games) => {
          console.log(games);
          if (!games.data.length) return;
          let bestGameUsers = bestInGame(games.data);
          if (!bestGameUsers.length) return;

          bestGameUsers.forEach((gameUser: any) => {
            res.data.forEach((classUser: any) => {
              if (gameUser.name === classUser.username) {
                console.log(true);
                tempArray.push(gameUser);
              }
            });
          });

          if (!tempArray.length) {
            setGameUsers([]);
            displayArray[1] = null;
          }

          setGameUsers(tempArray);
          displayArray[1] = tempArray;
        });
      });
    }
    if (!!selectedOptions.games) {
      setGameUsers([]);
      displayArray[1] = null;
    }
  }, [selectedOptions]);

  // useEffect(() => {
  if (!!selectedOptions.classes && !!users.length) {
    displayArray[0] = users;
  }
  if (!!selectedOptions.games && !!gameUsers.length) {
    displayArray[1] = gameUsers;
  }
  if (selectedOptions.fastest && !!fastestUsers.length) {
    displayArray[2] = fastestUsers;
  }
  if (selectedOptions.top10 && !!top10Users.length) {
    displayArray[3] = top10Users;
  }
  // }, [selectedOptions, users, gameUsers, fastestUsers, top10Users]);

  console.log(displayArray);
  console.log(selectedOptions);

  return (
    <Flex alignItems="center" justifyContent="center">
      <MenuWrapper
        style={{
          width: "90vw",
          height: "85vh",
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}
      >
        <Flex mt="5vh">
          {statisticsCategories.map((category, index) => (
            <Flex
              w="20vw"
              h="75vh"
              mr="1rem"
              key={index}
              flexDirection="column"
            >
              {!!category.options.length ? (
                <SelectDropdown
                  message={`Select one of ${category.category}`}
                  array={category.options}
                  setSelectedOptions={setSelectedOptions}
                  selectedOptions={selectedOptions}
                  selection={category.category}
                />
              ) : (
                <Button
                  mb="2rem"
                  w="20vw"
                  h="11.2vh"
                  onClick={() => fetchCategory(category.category)}
                >
                  <Text fontSize="1.3rem" fontStyle="normal">
                    {category.category}
                  </Text>
                </Button>
              )}
              <Stats key={category.category} data={displayArray[index]} />
            </Flex>
          ))}
        </Flex>
        <Flex justifyContent="center" alignItems="center" ml="2rem">
          {/* {Object.keys(selectedOptions).map((option, index) => (
            <Stats key={option} data={displayArray[index]} />
          ))} */}
        </Flex>
      </MenuWrapper>
    </Flex>
  );
};;
export default Statistics;
