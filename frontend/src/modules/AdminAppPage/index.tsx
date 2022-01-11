import React from "react";
import { Link } from "react-router-dom";
import { Flex, Box, Button } from "@chakra-ui/react";
import MathPicture from "../../assets/images/math.png";
import { MenuWrapper } from "../../styles";

const AdminAppPage = () => {
  return (
    <Flex
      justifyContent="center"
      style={{
        height: "calc(100vh - 50px)",
        backgroundImage: `url(${MathPicture})`,
        backgroundSize: "300px 300px",
      }}
    >
      <MenuWrapper>
        <Button mt="2" w={200}>
          <Link to="/addNewUser">Add New User</Link>
        </Button>
      </MenuWrapper>
    </Flex>
  );
};

export default AdminAppPage;
