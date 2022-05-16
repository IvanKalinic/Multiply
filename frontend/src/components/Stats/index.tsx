import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { MenuWrapper } from "../../styles";
import { getLevelUpperBound } from "../../utils";

const Stats = ({ data }: { data: Array<any> }) => {
  return (
    <MenuWrapper
      style={{
        width: "20vw",
        height: "60vh",
        marginRight: "2rem",
        visibility: !data?.length ? "hidden" : "visible",
        flexDirection: "column",
      }}
    >
      {data?.map((user) => (
        <Flex flexDirection="column" justifyContent="center" mt="2vh">
          <Heading size="md">{user.username}</Heading>
          <Flex alignItems="center" justifyContent="flex-start">
            <Flex flexDirection="column" alignItems="flex-start">
              <h3>
                Games (W/P): {user.gamesWon.length}/{user.gamesPlayed.length}
              </h3>
              <h3>
                Battles (W/P): {user.battlesWon.length}/
                {user.battlesPlayed.length}
              </h3>
              <h3>Points: {user.overallPoints}</h3>
              <h3>Speed: {user?.speed}</h3>
              <h5>{`${
                (user.gamesWon.length / user.gamesPlayed.length) * 100
              }% won`}</h5>
            </Flex>
            <CircularProgress
              value={
                (user.overallPoints / getLevelUpperBound(user?.levelNumber)) *
                100
              }
              color="green.400"
            >
              <CircularProgressLabel>
                <Flex flexDirection="column">
                  {/* calculate current points in that level and percentage based on how far is user to next level */}
                  <strong style={{ fontSize: "1.5rem" }}>
                    {user?.levelNumber}
                  </strong>
                </Flex>
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
        </Flex>
      ))}
    </MenuWrapper>
  );
};

export default Stats;
