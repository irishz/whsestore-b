import { AddIcon, CheckIcon, CloseIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Select,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import Navbar from "../Navbar/Navbar";

function STDCreate() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [boxList, setboxList] = useState([]);
  const [layerList, setlayerList] = useState([]);
  const [locList, setlocList] = useState([]);
  const [itemInput, setitemInput] = useState("");
  const [scanItemList, setscanItemList] = useState([]);
  const [selectedBox, setselectedBox] = useState(0);
  const [selectedLayer, setselectedLayer] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  let inputRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get(`${API_URL}/location-std`).then((res) => {
      setlocList(res.data);
    });
    axios.get(`${API_URL}/box`).then((res) => {
      setboxList(res.data);
    });
    axios.get(`${API_URL}/layer`).then((res) => {
      setlayerList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/location-std`).then((res) => {
      setlocList(res.data);
    });
  }, [isLoading]);

  function handleScanItem(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      inputRef.current.select();

      let createItemObj = {
        box: selectedBox,
        layer: selectedLayer,
        item: e.target.value,
      };
      const itemExist = scanItemList?.find(({ item }) => item === itemInput);
      const itemLocExist = locList?.find(({ item }) => item === itemInput);
      if (itemLocExist) {
        toast({
          title: "item นี้มีในระบบอยู่แล้ว",
          status: "error",
          duration: 3000,
        });
      }
      if (!itemExist && !itemLocExist) {
        const tempList = scanItemList.concat(createItemObj);
        setscanItemList(tempList);
        return;
      }
      console.log("item exist");
    }
  }

  function handleProcess() {
    setisLoading(true);
    let status = undefined;
    // loop create data
    scanItemList.forEach((data) => {
      axios.post(`${API_URL}/location-std`, data).then((res) => {
        if (res.status === 200) {
          status = res.data.msg;
        }
      });
    });
    console.log(status);
    //Check all data is created
    if (status) {
      onClose();
      toast({
        title: "เพิ่มข้อมูลใหม่สำเร็จ",
        status: "success",
        duration: 3000,
      });
      setisLoading(false);
      setscanItemList([]);
      setselectedBox(0);
      setselectedLayer(0);
      inputRef.current.value = "";
      inputRef.current.focus();
      return;
    }
    // Alert toast when data create not equal to create list
    onClose();
    toast({
      title: "เกิดข้อผิดพลาด",
      description:
        "ไม่สามารถเพิ่มข้อมูล กรุณาตรวจสอบข้อมูลและลองทำใหม่อีกครั้ง",
      status: "error",
      duration: 3000,
    });
    setisLoading(false);
    setscanItemList([]);
  }

  function handleScanItemListDelete(i) {
    let tempList = [...scanItemList];
    tempList.splice(i, 1);
    setscanItemList(tempList);
  }

  return (
    <Box>
      <Navbar />

      <Container
        maxW={{
          base: "container.sm",
          sm: "container.sm",
          md: "container.md",
          lg: "container.lg",
        }}
      >
        <Heading
          fontSize={"3xl"}
          color={"gray.600"}
          alignContent="center"
          mt={5}
          mb={3}
        >
          <AddIcon fontSize={"0.8em"} /> เพิ่ม item standard เข้า location
        </Heading>

        <Divider border borderColor={"gray.600"} />

        <Stack spacing={5} mt={3}>
          <Flex gap={5} alignItems="center">
            <Text>กล่อง: </Text>
            <ButtonGroup spacing={6} variant="solid">
              {boxList
                .sort((a, b) => a.box - b.box)
                .map(({ box }) => (
                  <Button
                    key={box}
                    bgColor={selectedBox === box ? "#C6A477" : "#ECD59F"}
                    onClick={() => setselectedBox(box)}
                  >
                    {box === 99 ? "อื่นๆ" : box}
                  </Button>
                ))}
            </ButtonGroup>
          </Flex>

          <Flex gap={5} alignItems={"center"} w="sm">
            <Text>ชั้น: </Text>
            <FormControl>
              <Select
                placeholder="เลือกชั้น"
                bgColor={"#ECD59F"}
                onChange={(e) => setselectedLayer(e.target.value)}
              >
                {layerList
                  .sort((a, b) => a.layer - b.layer)
                  .map(({ layer }) => (
                    <option value={layer} key={layer}>
                      {layer}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Flex>

          <Divider borderWidth={1} borderColor="gray.600" />

          {selectedBox && selectedLayer > 0 ? (
            <Box>
              <FormControl>
                <FormLabel>Scan Item</FormLabel>
                <Input
                  ref={inputRef}
                  type={"text"}
                  bgColor="#D3E7EE"
                  onKeyDown={(e) => handleScanItem(e)}
                  onKeyPress={(e) => handleScanItem(e)}
                  onChange={(e) => setitemInput(e.target.value)}
                  autoFocus
                />
              </FormControl>
              <Divider borderWidth={1} borderColor="gray.600" my={5} />
              <TableContainer overflowY={"auto"}>
                <Table variant={"striped"} size="md">
                  <TableCaption>
                    item ทั้งหมด :{" "}
                    <Badge colorScheme={"purple"}>{scanItemList.length}</Badge>
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th w="7%">ลำดับ</Th>
                      <Th>กล่อง</Th>
                      <Th>ชั้น</Th>
                      <Th>Item</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scanItemList.map(({ item, box, layer }, idx) => (
                      <Tr key={item}>
                        <Td>{idx + 1}</Td>
                        <Td>{box}</Td>
                        <Td>{layer}</Td>
                        <Td>{item}</Td>
                        <Td>
                          <DeleteIcon
                            w={4}
                            h={4}
                            color="red.500"
                            _hover={{ color: "red.300" }}
                            onClick={() => handleScanItemListDelete(idx)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Button
                leftIcon={<BiPlus />}
                variant="solid"
                color={"white"}
                bgColor={"#7097A8"}
                _hover={{ bgColor: "#5B7C89" }}
                onClick={onOpen}
                disabled={scanItemList.length > 0 ? false : true}
              >
                เพิ่ม Item ทั้งหมด
              </Button>
            </Box>
          ) : (
            <Alert status="info" variant={"left-accent"}>
              <AlertIcon />
              <AlertTitle>
                กรุณาเลือกกล่องและชั้นให้ครบถ้วนก่อนสแกน item
              </AlertTitle>
            </Alert>
          )}
        </Stack>

        <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ยืนยันการทำรายการ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              คุณได้ตรวจสอบรายการที่ต้องการเพิ่มทั้งหมดแล้วใช่หรือไม่?
            </ModalBody>
            <ModalFooter gap={2}>
              <Button
                variant={"solid"}
                colorScheme="teal"
                leftIcon={<CheckIcon />}
                onClick={() => handleProcess()}
                isLoading={isLoading}
                loadingText="กำลังดำเนินการ"
              >
                ตกลง
              </Button>
              <Button
                variant={"outline"}
                colorScheme="red"
                leftIcon={<CloseIcon />}
                onClick={onClose}
              >
                ยกเลิก
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}

export default STDCreate;
