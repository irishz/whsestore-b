import { DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { variables } from "../../Variables";
import Navbar from "../Navbar/Navbar";

function DeleteLocation() {
  const [historyList, sethistoryList] = useState([]);
  const [locFilterList, setlocFilterList] = useState([]);
  const [progress, setprogress] = useState(0);
  const [isUploading, setisUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()

  useEffect(() => {
    const histList = localStorage.getItem("historyScan");
    if (histList) {
      sethistoryList(JSON.parse(histList));
    }

    axios.get(variables.API_URL + "location").then((res) => {
      let tempList = [];
      tempList = res.data;
      tempList = tempList.filter((data) => histList.includes(data.job));
      setlocFilterList(tempList);
    });
  }, []);

  function handleDeleteJobList(idx) {
    const tempLocList = [...locFilterList];
    tempLocList.splice(idx, 1);
    setlocFilterList(tempLocList);
    const tempHistList = tempLocList.map((data) => data.job);
    localStorage.setItem("historyScan", JSON.stringify(tempHistList));
  }

  function handleProcessDelete() {
    console.log(locFilterList);
    let count = 0;
    setisUploading(true);
    locFilterList.forEach((data) => {
      axios.delete(variables.API_URL + `location/${data._id}`, {
        onUploadProgress: () => {
          count++;
          const progressPercent = (count / previewList.length) * 100;
          setprogress(progressPercent);
        },
      });
    });

      onClose();
      toast({
        title: "ลบข้อมูลสำเร็จ",
        status: "success",
        duration: 3000,
      });
      setisUploading(false);
      setlocFilterList([]);
      localStorage.removeItem("historyScan");
  }

  return (
    <Box>
      <Navbar />

      <Container maxWidth={"container.lg"}>
        <Stack spacing={5}>
          <Heading color={"gray.600"}>จำหน่าย Item</Heading>

          <Divider border borderColor={"gray.600"} />

          <Box>
            <FormControl>
              <FormLabel>ค้นหาโดยการสแกนหมายเลข Job</FormLabel>
              <Input type="text" />
            </FormControl>
          </Box>

          <Box>
            <TableContainer overflowY={"auto"}>
              <Table variant={"striped"} size="md">
                <TableCaption>
                  Job ทั้งหมด :{" "}
                  <Badge colorScheme={"purple"}>{locFilterList.length}</Badge>
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th w="7%">ลำดับ</Th>
                    <Th>โซน</Th>
                    <Th>ช่อง</Th>
                    <Th>Job</Th>
                    <Th>Item</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {locFilterList.map((item, idx) => (
                    <Tr key={item.job}>
                      <Td>{idx + 1}</Td>
                      <Td>{item.zone}</Td>
                      <Td>{item.ch}</Td>
                      <Td>{item.job}</Td>
                      <Td>{item.item}</Td>
                      <Td>
                        <DeleteIcon
                          w={4}
                          h={4}
                          color="red.500"
                          _hover={{ color: "red.300" }}
                          onClick={() => handleDeleteJobList(idx)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            <Button
              variant={"solid"}
              colorScheme="red"
              leftIcon={<MinusIcon />}
              onClick={onOpen}
            >
              จำหน่ายทั้งหมด
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
              motionPreset="slideInBottom"
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>ยืนยันการทำรายการ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  ต้องการจำหน่าย job ในรายการนี้ทั้งหมดใช่หรือไม่?
                </ModalBody>
                <ModalFooter gap={2}>
                  <Button
                    variant={"solid"}
                    colorScheme="teal"
                    onClick={() => handleProcessDelete()}
                    isLoading={isUploading}
                    loadingText="กำลังลบ"
                  >
                    ตกลง
                  </Button>
                  <Button
                    variant={"outline"}
                    colorScheme="red"
                    onClick={onClose}
                  >
                    ยกเลิก
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default DeleteLocation;
