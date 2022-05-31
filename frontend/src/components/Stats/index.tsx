import React, { memo } from "react";
import { MenuWrapper } from "../../styles";
import Warning from "../Warning";
import "./index.scss";
import StatsItem from "./StatsItem";

const Stats = ({ data }: { data: Array<any> }) => {
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
      {data !== null ? (
        data?.map((user) => <StatsItem userData={user} />)
      ) : (
        <Warning text="No users found" />
      )}
    </MenuWrapper>
  );
};

export default memo(Stats);
