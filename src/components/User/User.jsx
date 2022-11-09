import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
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
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`${API_URL}/users`).then((res) => {
      setuserList(res.data);
    });
  }, []);

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
                    />
                    <DeleteIcon
                      w={4}
                      h={4}
                      color="red"
                      _hover={{ color: "red.300" }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}

export default User;
