import { RepeatIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { BsCalculatorFill } from "react-icons/bs";
import { RiRefreshFill } from "react-icons/ri";
import Navbar from "../Navbar/Navbar";

function CalMatl() {
  return (
    <Box>
      <Navbar />

      <Container
        maxWidth={{
          base: "container.sm",
          md: "container.md",
          lg: "container.lg",
        }}
      >
        <Heading color={"gray.600"} display={"flex"} gap={2}>
          <BsCalculatorFill /> คำนวน Material
        </Heading>
        <Flex gap={3} mt={5} alignItems={'center'}>
          <FormControl>
            <FormLabel textTransform={'capitalize'}>start date</FormLabel>
            <Input type="date" />
          </FormControl>
          <FormControl>
            <FormLabel textTransform={'capitalize'}>end date</FormLabel>
            <Input type="date" />
          </FormControl>
          <FormControl>
            <FormLabel textTransform={'capitalize'}>item</FormLabel>
            <Input type={'text'}/>
          </FormControl>
          <Box>
          <Button variant={'solid'} colorScheme={'yellow'} leftIcon={<RepeatIcon />}>คำนวนใหม่</Button>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default CalMatl;
