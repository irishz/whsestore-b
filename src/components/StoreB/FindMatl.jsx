import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Divider,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";

function FindMatl() {
  function handleScanInput(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();

      console.log(e.target.value);
    }
  }

  return (
    <Box>
      <Navbar />

      <Container maxWidth={"container.lg"}>
        <Heading color={"gray.600"}>
          <SearchIcon w={7} h={7} mr={3} />
          ค้นหา Material
        </Heading>

        <Divider borderWidth={2} borderColor="gray.600" my={3} />

        <Box>
          <Text>ค้นหาโดยสแกน QR Code ตัด Matl. ในใบ job</Text>
          <Flex gap={3} justifyContent="space-between">
            <FormControl w="xs">
              <Input type={"text"} autoFocus />
            </FormControl>
            <FormControl>
              <Input type={"text"} />
            </FormControl>
            <FormControl w="md">
              <Input type={"number"} />
            </FormControl>
            <FormControl w="md">
              <Input type={"number"} />
            </FormControl>
            <FormControl w="lg">
              <Input type={"number"} onKeyDown={(e) => handleScanInput(e)} />
            </FormControl>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

export default FindMatl;
