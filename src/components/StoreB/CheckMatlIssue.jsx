import {
  Box,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";

function CheckMatlIssue() {
  return (
    <Box>
      <Navbar />

      <Container
        maxWidth={{
          base: "container.xl",
          sm: "container.sm",
          md: "container.md",
          lg: "container.lg",
        }}
        h="full"
      >
        <Stack alignItems={"center"} spacing={5}>
          <FormControl>
            <FormLabel>Job</FormLabel>
            <Input type={"text"} autoFocus/>
          </FormControl>

          <Divider borderColor={"gray.600"} />
          <FormControl>
            <Input type={"text"} />
          </FormControl>
          <FormControl>
            <Input type={"text"} />
          </FormControl>
          <FormControl>
            <Input type={"text"} />
          </FormControl>
        </Stack>
      </Container>
    </Box>
  );
}

export default CheckMatlIssue;
