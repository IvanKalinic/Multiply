import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import { fetchSpecificUser } from "../../../apis";
import { getLevelUpperBound } from "../../../utils";
import Warning from "../../Warning";

interface UserData {
  username: string;
  gamesWon: number;
  gamesPlayed: number;
  battlesPlayed: number;
  battlesWon: number;
  overallPoints: number;
  speed: number;
  levelNumber: number;
  level: string;
  rank?: number;
}

export const StatsItem = ({ userData }: { userData: any }) => {
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    if (!!userData.name) {
      fetchSpecificUser(userData.name).then((res) => {
        setUser(res.data[0]);
      });
    } else {
      setUser(userData);
    }
  }, [userData]);

  return (
    <Flex flexDirection="column" justifyContent="center" mt="2vh">
      {!!user ? (
        <>
          <Heading size="md" ml={!user?.rank ? "-8vw" : "-5vw"}>
            {user?.username}
            {!!user?.rank && (
              <span
                style={{
                  fontWeight: "bold",
                  marginLeft: "3rem",
                  color: "green",
                }}
              >{`#${user.rank}`}</span>
            )}
          </Heading>
          <Flex alignItems="center" justifyContent="flex-start">
            <Flex flexDirection="column" alignItems="flex-start">
              <h3>
                Games (W/P): {user?.gamesWon || 0}/{user?.gamesPlayed || 0}
              </h3>
              <h3>
                Battles (W/P): {user?.battlesWon || 0}/
                {user?.battlesPlayed || 0}
              </h3>
              <h3>Points: {user?.overallPoints}</h3>
              <h3>Speed: {user?.speed}</h3>
              <h5
                style={{
                  fontWeight: !!userData.wins ? "500" : "normal",
                  color: !!userData.wins ? "green" : "black",
                }}
              >
                {!userData.wins
                  ? `${
                      ((user?.gamesWon || 0) / (user?.gamesPlayed || 1)) * 100
                    }% won`
                  : `${userData.wins} ${
                      userData.wins !== 1 ? "wins" : "win"
                    } in this game`}
              </h5>
            </Flex>
            <CircularProgress
              value={
                !!user.overallPoints
                  ? ((user.overallPoints -
                      getLevelUpperBound(user?.levelNumber - 1)) /
                      (getLevelUpperBound(user?.levelNumber) -
                        getLevelUpperBound(user?.levelNumber - 1))) *
                    100
                  : 0
              }
              color={
                ((user.overallPoints -
                  getLevelUpperBound(user?.levelNumber - 1)) /
                  (getLevelUpperBound(user?.levelNumber) -
                    getLevelUpperBound(user?.levelNumber - 1))) *
                  100 >
                50
                  ? "green.400"
                  : "red.400"
              }
              mt="-6vh"
              ml="2vw"
            >
              <CircularProgressLabel>
                <Flex flexDirection="column" alignItems="space-between">
                  {/* calculate current points in that level and percentage based on how far is user to next level */}
                  <h3 style={{ marginTop: "-1.5rem" }}>{user?.level}</h3>
                  <strong
                    style={{
                      fontSize: "1.5rem",
                      marginTop: "0.4rem",
                    }}
                  >
                    {user?.levelNumber}
                  </strong>
                  {/* <h3>Level number</h3> */}
                </Flex>
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
        </>
      ) : null}
      {/* add loader here */}
    </Flex>
  );
};

export default memo(StatsItem);
