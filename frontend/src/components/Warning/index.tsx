import { Flex, Text } from "@chakra-ui/react";

const Warning = ({ text }: { text: string }) => {
  return (
    <Flex
      style={{
        position: "relative",
        bottom: "-20px",
        left: "100px",
        maxWidth: "300px",
        height: "60px",
      }}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text fontSize="2xl" color="red">
        <strong>{text}</strong>
      </Text>
    </Flex>
  );
};

export default Warning;
