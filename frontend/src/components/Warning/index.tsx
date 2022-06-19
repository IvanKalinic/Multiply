import { Flex, Text } from "@chakra-ui/react";

const Warning = ({ text }: { text: string | JSX.Element }) => {
  return (
    <Flex
      marginRight="1rem"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
    >
      <Text fontSize="1xl" color="#cf084a">
        <strong>{text}</strong>
      </Text>
    </Flex>
  );
};

export default Warning;
