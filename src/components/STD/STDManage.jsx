import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
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
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import moment from "moment";
import { CloseIcon, DeleteIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function STDManage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [locStdList, setlocStdList] = useState([]);
  const [searchInput, setsearchInput] = useState("");
  const [selectedItem, setselectedItem] = useState({});
  const [isDeleted, setisDeleted] = useState(false);
  const searchInputRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${API_URL}/location-std`).then((res) => {
      setlocStdList(res.data);
    });

    return () => {
      setlocStdList([]);
    };
  }, [isDeleted]);

  function handleSearchInputClear() {
    setsearchInput("");
    searchInputRef.current.focus();
    searchInputRef.current.value = "";
  }

  function setEditDeleteItem(id) {
    let tempList = locStdList.find(({ _id }) => _id === id);

    if (tempList) {
      setselectedItem(tempList);
      return;
    }
  }

  function handleEditIconClick(id) {
    let item = locStdList.find(({_id}) => _id ===id)
    if (item) {
      navigate('/std/edit', {state: item})
    }
  }
  
  function handleDeleteIconClick() {
    setisDeleted(true);
    onClose();
    axios
      .delete(`${API_URL}/location-std/${selectedItem._id}`)
      .then((res) => {
        if ((res.status = 200)) {
          toast({
            title: "ลบข้อมูลสำเร็จ",
            status: "success",
            duration: 3000,
            onCloseComplete: () => {
              setisDeleted(false);
            },
          });
          return;
        }
      })
      .catch((err) => {
        if (err) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบข้อมูล",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      });
  }

  return (
    <Box>
      <Navbar />

      <Container
        maxW={{ base: "container.sm", md: "container.md", lg: "container.lg" }}
      >
        <Heading color={"gray.600"} my={4}>
          จัดการ Location
        </Heading>

        <Box display={"flex"} justifyContent={"end"}>
          <InputGroup w={"50%"}>
            <InputLeftElement
              children={
                <SearchIcon
                  cursor="pointer"
                  color="blue.400"
                  _hover={{ fontSize: "1.2em", fontWeight: "semibold" }}
                />
              }
            />
            <Input
              ref={searchInputRef}
              placeholder="ระบุ item เพื่อค้นหา..."
              color={"gray.600"}
              _focus={{ borderColor: "blue.500", boxShadow: "sm" }}
              onChange={(e) => setsearchInput(e.target.value)}
            />
            <InputRightElement
              children={
                searchInput && (
                  <CloseIcon
                    fontSize={"1.2em"}
                    color="red.400"
                    p={1}
                    _hover={{ bgColor: "red.200" }}
                    onClick={() => handleSearchInputClear()}
                  />
                )
              }
            />
          </InputGroup>
        </Box>
        <TableContainer display={"block"} dropShadow="lg">
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>Item</Th>
                <Th>กล่อง</Th>
                <Th>ชั้น</Th>
                <Th>สร้างเมื่อ</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {locStdList
                .filter(({ item }) => item.includes(searchInput))
                .map(({ _id, item, box, layer, createdAt }, idx) => (
                  <Tr key={_id}>
                    <Td>{idx + 1}</Td>
                    <Td>{item}</Td>
                    <Td>{box}</Td>
                    <Td>{layer}</Td>
                    <Td>{moment(createdAt).format("LLL")}</Td>
                    <Td>
                      <EditIcon
                        w={4}
                        h={4}
                        mx={2}
                        color="facebook"
                        _hover={{ color: "facebook.300" }}
                        onClick={() => handleEditIconClick(_id)}
                      />
                      <DeleteIcon
                        w={4}
                        h={4}
                        color="red"
                        _hover={{ color: "red.300" }}
                        onClick={() => {
                          onOpen();
                          setEditDeleteItem(_id);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>คุณต้องการลบข้อมูลนี้ใช่หรือไม่?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>item: {selectedItem.item}</Text>
              <Text>กล่อง: {selectedItem.box}</Text>
              <Text>ชั้น: {selectedItem.layer}</Text>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant={"solid"}
                colorScheme={"red"}
                leftIcon={<DeleteIcon />}
                onClick={() => handleDeleteIconClick()}
              >
                ลบ
              </Button>
              <Button
                variant={"outline"}
                colorScheme={"gray"}
                onClick={() => onClose()}
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

export default STDManage;
