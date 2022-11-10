import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
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
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { BsPersonFill } from "react-icons/bs";
import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

function User() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userList, setuserList] = useState([]);
  const [isBtnDeleteLoading, setisBtnDeleteLoading] = useState(false);
  const [selectedUser, setselectedUser] = useState({});
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    axios.get(`${API_URL}/users`).then((res) => {
      setuserList(res.data);
    });
  }, [isBtnDeleteLoading]);

  function handleEditClick(id) {
    let userData = userList.find(({ _id }) => _id === id);
    if (userData) {
      navigate("/user/edit", { state: userData });
      return;
    }
  }

  function handleDeleteClick(id) {
    onOpen();
    const user = userList.find(({ _id }) => _id === id);
    setselectedUser(user);
  }

  function processDelete() {
    const { _id } = selectedUser;
    setisBtnDeleteLoading(true);
    axios
      .delete(`${API_URL}/users/${_id}`)
      .then((res) => {
        if (res.status === 200) {
          onClose();
          toast({
            title: res.data.msg,
            status: "success",
            duration: 2000,
            position: "bottom-right",
          });
          setisBtnDeleteLoading(false);
        }
      })
      .catch((err) => {
        if (err) {
          onClose();
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถลบข้อมูล",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      });
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth={"container.lg"}>
        <Flex
          borderBottom
          borderColor={"gray.500"}
          borderBottomWidth={2}
          px={3}
          py={2}
          justifyContent="space-between"
        >
          <Heading
            display={"inline-flex"}
            alignItems="center"
            fontSize={24}
            color="gray.600"
          >
            <BsPersonFill /> จัดการผู้ใช้
          </Heading>
          <Button
            leftIcon={<PlusSquareIcon />}
            variant="outline"
            colorScheme={"green"}
            onClick={() => navigate("/user/create")}
          >
            เพิ่มผู้ใช้
          </Button>
        </Flex>

        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>ชื่อผู้ใช้งาน</Th>
                <Th>แผนก</Th>
                <Th>สร้างเมื่อ</Th>
                <Th>แก้ไขล่าสุด</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {userList.map((user, idx) => (
                <Tr key={user.name}>
                  <Td>{idx + 1}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.department}</Td>
                  <Td>{moment(user.createAt).format("DD/MM/YYYY HH:mm")}</Td>
                  <Td>{moment(user.updateAt).format("DD/MM/YYYY HH:mm")}</Td>
                  <Td display="inline-block">
                    <EditIcon
                      w={4}
                      h={4}
                      color="facebook"
                      _hover={{ color: "facebook.300" }}
                      mx={2}
                      onClick={() => handleEditClick(user._id)}
                    />
                    <DeleteIcon
                      w={4}
                      h={4}
                      color="red"
                      _hover={{ color: "red.300" }}
                      onClick={() => handleDeleteClick(user._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>

      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              คุณต้องการลบผู้ใช้ {selectedUser.name} ใช่หรือไม่?
            </ModalHeader>
            <ModalCloseButton />
            <ModalFooter gap={2}>
              <Button
                variant={"solid"}
                colorScheme={"red"}
                leftIcon={<EditIcon />}
                isLoading={isBtnDeleteLoading}
                loadingText={"กำลังลบ"}
                onClick={processDelete}
              >
                ลบ
              </Button>
              <Button onClick={onClose}>ยกเลิก</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default User;
