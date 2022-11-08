import {
  Box,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Navbar from "../Navbar/Navbar";
import moment from "moment";
import axios from "axios";
import { SearchIcon } from "@chakra-ui/icons";
import "moment/dist/locale/th";

function MatlTrans() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [start_date, setstart_date] = useState(moment().format("YYYY-MM-DD"));
  const [end_date, setend_date] = useState(moment().format("YYYY-MM-DD"));
  const [job, setjob] = useState("");
  const [jobTransList, setjobTransList] = useState([]);
  useMemo(() => fetchData, [start_date, end_date, job]);
  const toast = useToast();

  function handleSearch(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      fetchData();
      return;
    }
    if (e.type === "click") {
      fetchData();
      return;
    }
  }

  async function fetchData() {
    setjobTransList([]);
    await axios
      .get(
        `${
          API_URL
        }/jobtrans/history/?job=${job}&start_date=${start_date}&end_date=${moment(
          end_date
        )
          .add(1, "day")
          .format("YYYY-MM-DD")}`
      )
      .then((res) => {
        console.log(res.data);
        setjobTransList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth={["container.sm", "container.md", "container.lg"]}>
        <Stack>
          <Flex gap={3}>
            <FormControl>
              <FormLabel>วันที่เริ่มต้น</FormLabel>
              <Input
                type={"date"}
                onChange={(e) => setstart_date(e.target.value)}
                value={start_date}
                color="gray.600"
              />
            </FormControl>
            <FormControl>
              <FormLabel>วันที่สิ้นสุด</FormLabel>
              <Input
                color={"gray.600"}
                type={"date"}
                onChange={(e) => setend_date(e.target.value)}
                value={end_date}
              />
            </FormControl>
          </Flex>
          <FormControl>
            <FormLabel>Job</FormLabel>
            <InputGroup>
              <Input
                color={"gray.600"}
                autoFocus
                type={"text"}
                value={job}
                onChange={(e) => setjob(e.target.value)}
                onKeyPress={(e) => handleSearch(e)}
                onKeyDown={(e) => handleSearch(e)}
              />
              <InputRightElement
                color={"blue.600"}
                cursor="pointer"
                rounded="md"
                zIndex={0}
                _hover={{ bgColor: "blue.100", color: "white" }}
                children={<SearchIcon />}
                onClick={(e) => handleSearch(e)}
              />
            </InputGroup>
          </FormControl>
        </Stack>

        <Divider my={5} />

        {/* {jobTransList.length > 0 ? ( */}
        <TableContainer>
          <Table variant={"simple"} size="sm">
            <Thead>
              <Tr>
                <Th>job</Th>
                <Th>item matl</Th>
                <Th>status</Th>
                <Th>issued by</Th>
                <Th>created at</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobTransList.map(({ job, item_matl, createdAt, created_by }) =>
                item_matl.map(({ _id, item, status }) => (
                  <Tr key={_id}>
                    <Td>{job}</Td>
                    <Td>{item}</Td>
                    <Td>
                      <Text
                        fontWeight={"semibold"}
                        rounded={"md"}
                        py={1}
                        px={2}
                        textAlign={"center"}
                        bgColor={status ? "green.200" : "red.200"}
                        color={status ? "green" : "red"}
                      >
                        {status ? "OK" : "NG"}
                      </Text>
                    </Td>
                    <Td>{created_by.name}</Td>
                    <Td>{moment(createdAt).format("lll")}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {/* ) : null} */}
      </Container>
    </Box>
  );
}

export default MatlTrans;
