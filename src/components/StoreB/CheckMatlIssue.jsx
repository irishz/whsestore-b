import {
  Box,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";

function CheckMatlIssue() {
  const [jobMatlList, setjobMatlList] = useState([]);
  const [job, setjob] = useState("");
  const inputRef = useRef();

  function handleJobScan(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      const jobTemp = e.target.value;
      setjobMatlList(job);
      axios.get(`http://192.168.2.13/api/getjobmatl/${jobTemp}`).then((res) => {
        console.log(res.data);
        setjobMatlList(res.data);
      });
    }
  }

  function handleItemScan(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();

      const itemTemp = e.target.value;
      if (jobMatlList.find((job) => job.item === itemTemp)) {
        // Create to issuematl table
        console.log("matl found!");
        return
      }
      console.log("matl not found!");
    }
  }
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
            <Input
              type={"text"}
              autoFocus
              onKeyDown={(e) => handleJobScan(e)}
              onKeyPress={(e) => handleJobScan(e)}
            />
          </FormControl>

          <Divider borderColor={"gray.600"} />
          <VStack spacing={3} w="full">
            {jobMatlList.length > 0 ? (
              jobMatlList.map((item, idx) => (
                <FormControl key={item.item}>
                  <Input
                    type={"text"}
                    onKeyDown={(e) => handleItemScan(e)}
                    onKeyPress={(e) => handleItemScan(e)}
                  />
                </FormControl>
              ))
            ) : (
              <Text
                bgColor={"#BCE6FF"}
                color="#015C92"
                py={3}
                px={10}
                rounded="md"
                fontWeight={"semibold"}
              >
                กรุณาสแกนหมายเลข Job
              </Text>
            )}
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
}

export default CheckMatlIssue;
