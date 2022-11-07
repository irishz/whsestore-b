import { RepeatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
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
import React, { useRef, useState } from "react";
import { BsCalculatorFill } from "react-icons/bs";
import Navbar from "../Navbar/Navbar";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function CalMatl() {
  const [jobList, setjobList] = useState([]);
  const [sumFG, setsumFG] = useState(0);
  const [leftovers, setleftovers] = useState(0);
  const [matlQty, setmatlQty] = useState(0);
  const [matlUM, setmatlUM] = useState("");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      start_date: new Date(),
      end_date: new Date(),
      item: "",
    },
  });
  const toast = useToast();
  let itemInputRef = useRef();
  let qtyLeftoversRef = useRef();

  function setTotalValue() {
    let sum = 0;
    if (jobList.length < 1) {
      return;
    }
    sum = jobList.reduce(
      (count, obj) => parseInt(count) + parseInt(obj.qty_released),
      0
    );
    console.log(sum);
    setsumFG(sum);
    setmatlQty(jobList[0].MatlQty);
    switch (jobList[0].MatlUM) {
      case "M":
        setmatlUM("เมตร");
        break;
      case "Sht":
        setmatlUM("แผ่น");
        break;
      default:
        setmatlUM("");
        break;
    }
  }

  const onSubmit = (data) => {
    const { start_date, end_date, item } = data;
    let tempStartDate = moment(start_date).format("YYYY-MM-DD");
    let tempEndDate = moment(end_date).format("YYYY-MM-DD");
    axios
      .get(
        `http://192.168.2.13/api/jobview/${item}/${tempStartDate}/${tempEndDate}`
      )
      .then((res) => {
        setjobList(res.data);
        setTotalValue();
        qtyLeftoversRef.current.focus();
      })
      .catch((err) => {
        if (err.status) {
          toast({
            title: "ไม่พบข้อมูล",
            description: "กรุณาตรวจสอบหมายเลข Item หรือ StartDate อีกครั้ง",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      });
  };

  function handleReset() {
    reset();
    setsumFG(0);
    setjobList([]);
    setmatlQty(0);
    setleftovers(0);
  }

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
        <form noValidate onSubmit={handleSubmit(onSubmit)} id="job-form">
          <Flex gap={5} mt={5} alignItems={"center"}>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>start date</FormLabel>
              <Controller
                control={control}
                name="start_date"
                render={({ field }) => (
                  <ReactDatePicker
                    placeholderText="เลือกวันที่เริ่มต้น"
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>end date</FormLabel>
              <Controller
                control={control}
                name="end_date"
                render={({ field }) => (
                  <ReactDatePicker
                    placeholderText="เลือกวันที่สิ้นสุด"
                    dateFormat={"dd/MM/yyyy"}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </FormControl>
            <FormControl>
              <FormLabel textTransform={"capitalize"}>item</FormLabel>
              <Input ref={itemInputRef} type={"text"} {...register("item")} />
            </FormControl>
            <Box display={"flex"} flexDirection="column" gap={2}>
              <Button
                type="submit"
                w={"full"}
                variant={"solid"}
                colorScheme={"blue"}
                leftIcon={<BsCalculatorFill />}
              >
                คำนวน
              </Button>
              <Button
                variant={"outline"}
                colorScheme={"yellow"}
                leftIcon={<RepeatIcon />}
                onClick={() => handleReset()}
              >
                คำนวนใหม่
              </Button>
            </Box>
          </Flex>
        </form>

        {/* Accordion Table Job List */}
        <Accordion allowToggle mt={3}>
          <AccordionItem>
            <AccordionButton>
              <Flex justifyContent={"space-between"} w="full">
                <Flex>
                  <Flex textAlign={"left"}>แสดงรายการทั้งหมด</Flex>
                  <AccordionIcon />
                </Flex>
                <Box>
                  <Text>
                    รายการทั้งหมด : <strong>{jobList.length}</strong>
                  </Text>
                </Box>
              </Flex>
            </AccordionButton>

            <AccordionPanel>
              <TableContainer display={"block"} h={400} overflowY={"auto"}>
                <Table variant={"striped"} size="sm">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Job</Th>
                      <Th>Oper Num</Th>
                      <Th>ItemJob</Th>
                      <Th>Job StartDate</Th>
                      <Th isNumeric>Matl Qty</Th>
                      <Th isNumeric>Qty Order</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {jobList.map(
                      (
                        {
                          job,
                          OperNum,
                          ItemJob,
                          JobStartDate,
                          MatlQty,
                          qty_released,
                        },
                        idx
                      ) => (
                        <Tr key={job}>
                          <Td>{idx + 1}</Td>
                          <Td>{job}</Td>
                          <Td>{OperNum}</Td>
                          <Td>{ItemJob}</Td>
                          <Td>{moment(JobStartDate).format("DD/MM/YYYY")}</Td>
                          <Td isNumeric>{MatlQty}</Td>
                          <Td isNumeric>{parseInt(qty_released).toFixed(0)}</Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Divider my={3} />

        {jobList.length > 0 ? (
          <FormControl>
            <Stack borderWidth={1} rounded="md" boxShadow={"sm"} p={3}>
              <Flex alignItems={"center"}>
                <FormLabel>เบิกของเหลือ :</FormLabel>
                <NumberInput
                  ref={qtyLeftoversRef}
                  value={leftovers}
                  onChange={(value) => setleftovers(value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>
              <Flex justifyContent={"space-between"}>
                <Flex gap={3} alignItems="baseline" fontSize={"4xl"}>
                  <Text>รวม FG: </Text>
                  <Text color="red.600" fontSize={"5xl"} fontWeight="semibold">
                    {sumFG}
                  </Text>
                </Flex>
                <Flex gap={3} alignItems="baseline" fontSize={"4xl"}>
                  <Text>จ่าย: </Text>
                  <Text color="red.600" fontSize={"5xl"} fontWeight="semibold">
                    {Math.ceil((sumFG - leftovers) / matlQty) || 0}
                  </Text>
                  <Text>{matlUM}</Text>
                </Flex>
                <Flex></Flex>
              </Flex>
            </Stack>
          </FormControl>
        ) : null}
      </Container>
    </Box>
  );
}

export default CalMatl;
