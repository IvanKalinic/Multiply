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
import "./index.scss";

const Stats = ({ data }: { data: Array<any> }) => {
  return (
    <MenuWrapper
      style={{
        width: "20vw",
        height: "60vh",
        marginRight: "2rem",
        visibility: !data?.length ? "hidden" : "visible",
        flexDirection: "column",
        boxShadow: "0 0.25rem 0.25rem rgba(0, 0, 0, 0.25)",
        overflowY: "scroll",
        whiteSpace: "nowrap",
        scrollBehavior: "smooth",
        position: "relative",
        top: "0",
        left: "0",
      }}
      className="webkit-scrollbar"
    >
      {data?.map((user) => (
        <Flex flexDirection="column" justifyContent="center" mt="2vh">
          <Heading size="md" ml="-8vw">
            {user.username}
          </Heading>
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
                (user?.gamesWon?.length / user?.gamesPlayed?.length) * 100
              }% won`}</h5>
            </Flex>
            <CircularProgress
              value={
                ((user.overallPoints -
                  getLevelUpperBound(user?.levelNumber - 1)) /
                  (getLevelUpperBound(user?.levelNumber) -
                    getLevelUpperBound(user?.levelNumber - 1))) *
                100
              }
              color="green.400"
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
        </Flex>
      ))}
    </MenuWrapper>
  );
};

export default Stats;
