import { Flex, Text } from "@chakra-ui/react";
import { useGame } from "../../context/GameContext";
import { useUser } from "../../context/UserContext";
import { PawnWrapper } from "../components.style";

const Pawns = () => {
  const { maxClicks } = useGame();
  const { user } = useUser();
  let pawnsArray: Array<any> = [1, 2, 3, 4];

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ position: "relative", left: "2rem" }}
    >
      {pawnsArray.map(
        (item) =>
          item > maxClicks && (
            <PawnWrapper
              key={item}
              color={user?.color ? user.color : undefined}
            />
          )
      )}
    </Flex>
  );
};

export default Pawns;
