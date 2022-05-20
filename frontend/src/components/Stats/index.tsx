import {
  Box,
  calc,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MenuWrapper } from "../../styles";
import { getLevelUpperBound } from "../../utils";
import "./index.scss";
import StatsItem from "./StatsItem";

const Stats = ({ data }: { data: Array<any> }) => {
  console.log(data);

  return (
    <MenuWrapper
      style={{
        width: "20vw",
        height: "100vh",
        marginRight: "2rem",
        paddingBottom: "2rem",
        visibility: !data?.length ? "hidden" : "visible",
        flexDirection: "column",
        justifyContent: "flex-start",
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
        <StatsItem userData={user} />
      ))}
    </MenuWrapper>
  );
};

export default Stats;
