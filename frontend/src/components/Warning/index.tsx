import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Warning = () => {
  return (
    <div style={{ marginTop: "-10px" }}>
      <Text fontSize="2xl" color="red">
        You must select an option
      </Text>
    </div>
  );
};

export default Warning;
