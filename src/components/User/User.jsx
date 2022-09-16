import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";
import { BsFillPersonFill, BsPersonFill } from "react-icons/bs";
import { PlusSquareIcon } from "@chakra-ui/icons";

function User() {
  return (
    <Box>
      <Navbar />

      <Container maxWidth={"container.lg"}>
        <Flex
          borderBottom
          borderColor={"gray.500"}
          borderBottomWidth={2}
          px={3}
          py={2}
          justifyContent="space-between"
        >
          <Text display={"inline-flex"} alignItems="center" fontSize={24}>
            <BsPersonFill /> จัดการผู้ใช้
          </Text>
          <Button
            leftIcon={<PlusSquareIcon />}
            variant="outline"
            colorScheme={"green"}
          >
            เพิ่มผู้ใช้
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}

export default User;
