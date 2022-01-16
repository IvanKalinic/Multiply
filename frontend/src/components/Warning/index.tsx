import { Flex, Text } from "@chakra-ui/react";

const Warning = ({ text }: { text: string }) => {
  return (
    <Flex
      style={{
        position: "relative",
        bottom: "-1.25rem",
        left: "6.25rem",
        maxWidth: "18.75rem",
        height: "3.75rem",
      }}
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text fontSize="2xl" color="#cf084a">
        <strong>{text}</strong>
      </Text>
    </Flex>
  );
};

export default Warning;
