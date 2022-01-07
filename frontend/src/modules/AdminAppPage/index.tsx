import React from "react";
import { Link } from "react-router-dom";
import { Box, Button } from "@chakra-ui/react";

const AdminAppPage = () => {
  return (
    <Box>
      <Button mt="2" w={200}>
        <Link to="/addNewUser">Add New User</Link>
      </Button>
    </Box>
  );
};

export default AdminAppPage;
