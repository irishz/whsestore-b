import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  List,
  ListItem,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBoolean,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CalendarIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { DateRangePicker } from "react-date-range";
import th from "date-fns/locale/th";
import moment from "moment";
import "moment/dist/locale/th";
import axios from "axios";

function MatlTrans() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobInput, setjobInput] = useState("");
  const [jobList, setjobList] = useState([]);
  const [dateRangeBtnText, setdateRangeBtnText] = useState("เลือกวันที่");
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [dateRangeToggle, setdateRangeToggle] = useBoolean(false);
  const [isBtnLoading, setisBtnLoading] = useState(false);

  const jobRef = useRef();

  function handleInputChange(e) {
    setjobInput(e.target.value);
  }

  function handleDateSelect(ranges) {
    setstartDate(ranges.selection.startDate);
    setendDate(ranges.selection.endDate);
    let dateRangeText =
      moment(ranges.selection.startDate).format("DD/MM/YYYY") +
      " - " +
      moment(ranges.selection.endDate).format("DD/MM/YYYY");
    setdateRangeBtnText(dateRangeText);
  }

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  function handleSearchClick() {
    setisBtnLoading(true)
    axios
      .get(
        `${API_URL}/jobtrans/history?start_date=${startDate}&end_date=${endDate}&job=${jobInput}`
      )
      .then((res) => {
        console.log(res.data);
        setjobList(res.data);
        setisBtnLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setisBtnLoading(false)
      });
  }

  function handleJobReset() {
    setjobInput("");
    jobRef.current.value = "";
    jobRef.current.focus();
  }

  return (
    <Box>
      <Navbar />

      <Flex
        m={3}
        direction={{
          base: "column",
          sm: "column",
          md: "row",
          lg: "row",
          xl: "row",
        }}
        gap={2}
      >
        {/* Job Input */}
        <InputGroup w={{ base: "100%", lg: "50%" }}>
          <InputLeftAddon children={<SearchIcon />} />
          <Input
            ref={jobRef}
            type={"text"}
            onChange={handleInputChange}
            maxLength={10}
            placeholder="ค้นหาโดยใส่หมายเลข job..."
          />
          <InputRightElement
            children={
              jobInput ? (
                <CloseIcon
                  color={"gray"}
                  onClick={handleJobReset}
                  transitionDuration={"500ms"}
                  _hover={{ color: "gray.600" }}
                />
              ) : null
            }
          />
        </InputGroup>

        <Button
          w={{ base: "100%", lg: "25%" }}
          leftIcon={<CalendarIcon />}
          colorScheme={"orange"}
          onClick={setdateRangeToggle.toggle}
        >
          {dateRangeBtnText}
        </Button>

        <Button
          w={{ base: "100%", lg: "25%" }}
          leftIcon={<SearchIcon />}
          colorScheme="facebook"
          onClick={handleSearchClick}
          isDisabled={dateRangeBtnText === "เลือกวันที่" ? true : false}
          isLoading={isBtnLoading}
        >
          ค้นหา
        </Button>
      </Flex>
      {dateRangeToggle ? (
        <Stack position={"absolute"} right={80}>
          <DateRangePicker
            locale={th}
            ranges={[selectionRange]}
            onChange={handleDateSelect}
            rangeColors={["#F17527"]}
          />
          <Button
            colorScheme={"orange"}
            size="sm"
            onClick={setdateRangeToggle.off}
          >
            ตกลง
          </Button>
        </Stack>
      ) : null}

      {/* Job List Table */}
      {jobList.length > 0 ? (
        <TableContainer display={"block"}>
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>job</Th>
                <Th>item material</Th>
                <Th>ผู้จ่าย</Th>
                <Th>จ่ายเมื่อ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {jobList
                .filter(({ job }) =>
                  job.toLowerCase().includes(jobInput.toLowerCase())
                )
                .map((job, idx) => {
                  return (
                    <Tr key={job._id} alignItems="start" h={"auto"}>
                      <Td>{idx + 1}</Td>
                      <Td>{job.job}</Td>
                      <Td>
                        <List spacing={2}>
                          {job.item_matl.map(({ item, status }) => {
                            return (
                              <ListItem display={'flex'} alignItems='center' gap={2}>
                                <Text>{item}</Text>
                                <Text
                                  color={status ? "green.600" : "red.600"}
                                  bgColor={status ? "green.100" : "red.100"}
                                  rounded='md'
                                  p={1}
                                  fontWeight='semibold'
                                  fontSize={'12px'}
                                >
                                  {status ? "OK" : "NG"}
                                </Text>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Td>
                      <Td>{job.created_by?.name}</Td>
                      <Td>{moment(job.createdAt).format("LLLL")}</Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
    </Box>
  );
}

export default MatlTrans;
