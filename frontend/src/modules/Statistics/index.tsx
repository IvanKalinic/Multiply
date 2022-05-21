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
import { bestInGame, bestPlayerSort } from "../../utils";

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
      if (!!users.length) setUsers([]);
      fetchUsersFromClassName(selectedOptions.classes).then((res) => {
        console.log(res);
        setUsers(bestPlayerSort(res.data));
        displayArray[0] = [...users];
      });
    }

    if (!selectedOptions.games) displayArray[1] = null;
    if (!!selectedOptions.games && !selectedOptions.classes) {
      fetchGameScores(selectedOptions.games).then((res) => {
        console.log(res);
        setGameUsers(bestInGame(res.data));
        displayArray[1] = bestInGame(res.data);
      });
      // console.log(gameUsers);
      //   if (!!selectedOptions.classes) {
      //     // setGameUsers(res.data.map(gameUser => {
      //     // map po fetchanim userima  da poklapaju sa userima iz tog razreda
      //     // }))
      //   } else {
      //     // setGameUsers(res.data)   --U OBA SLUČAJA POSLAT ARRAY U FUNKCIJU KOJA SORTIRA PO ŽELJENOM PARAMETRU I ONDA SETSTATE
      //   }
      //   setGameUsers(res.data);
      //   // setDisplayArray((dispArray) => [...dispArray, gameUsers]);
    }
    if (!!selectedOptions.fastest || !!selectedOptions.top10) {
      fetchAllUsers().then((res) => {
        if (!!selectedOptions.classes) {
          // setFastestUsers(res.data.map()) isto ko i u proslom
        } else {
          if (!!selectedOptions.fastest) {
            // setDisplayArray((dispArray) => [...dispArray, fastestUsers]);
          }
          if (!!selectedOptions.top10) {
            // setDisplayArray((dispArray) => [...dispArray, top10Users]);
          }
        }
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
          console.log("Here");

          console.log(bestGameUsers);
          console.log(res.data);
          bestGameUsers.forEach((gameUser: any) => {
            res.data.forEach((classUser: any) => {
              if (gameUser.name === classUser.username) {
                console.log(true);
                tempArray.push(gameUser);
              }
            });
          });

          console.log(tempArray);

          if (!tempArray.length) {
            setGameUsers([]);
            displayArray[1] = null;
          }

          setGameUsers(tempArray);
          displayArray[1] = [...tempArray];
        });
      });
    }
    if (!!selectedOptions.games) {
      setGameUsers([]);
      displayArray[1] = null;
    }
  }, [selectedOptions.classes]);

  console.log(gameUsers);
  console.log(users);
  console.log(selectedOptions);
  console.log(displayArray);

  // useEffect(() => {
  if (!!users.length) {
    displayArray[0] = selectedOptions.classes !== "" ? [...users] : null;
  }
  if (!!gameUsers.length) {
    displayArray[1] = selectedOptions.games !== "" ? [...gameUsers] : null;
  }
  if (!!fastestUsers.length) {
    displayArray[2] = !!selectedOptions.fastest && [...fastestUsers];
  }
  if (!!top10Users.length) {
    displayArray[3] = !!selectedOptions.top10 && [...top10Users];
  }

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
          {statisticsCategories.map((category, index) =>
            !!category.options.length ? (
              <Flex
                w="20vw"
                h="75vh"
                mr="1rem"
                key={index}
                flexDirection="column"
              >
                <SelectDropdown
                  message={`Select one of ${category.category}`}
                  array={category.options}
                  setSelectedOptions={setSelectedOptions}
                  selectedOptions={selectedOptions}
                  selection={category.category}
                />
                <Stats key={category.category} data={displayArray[index]} />
              </Flex>
            ) : (
              <Button
                mr="4"
                mb="2rem"
                w="15vw"
                h="3rem"
                onClick={() => fetchCategory(category.category)}
              >
                <Text fontSize="1.3rem" fontStyle="normal">
                  {category.category}
                </Text>
              </Button>
            )
          )}
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
