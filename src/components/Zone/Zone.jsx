import { Box, Flex, Table } from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";

function Zone() {
  return (
    <Box>
      <Navbar />
      <Box maxWidth={"container.lg"} mt={5}>
        <Flex justifyContent={"space-between"} px={3}>
            <Box>จัดการโซน</Box>
            <Table></Table>
        </Flex>
      </Box>
    </Box>
  );
}

export default Zone;
