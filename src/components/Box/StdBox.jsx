import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment/moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { variables } from "../../Variables";
import Navbar from "../Navbar/Navbar";

function StdBox() {
  const [boxList, setboxList] = useState([]);
  const toast = useToast();
  const [isDeleted, setisDeleted] = useState(false);

  useEffect(() => {
    axios.get(`${variables.API_URL}/box`).then((res) => {
      console.log(res.data);
      setboxList(res.data);
    });

    return () => {
      setisDeleted(false);
    };
  }, [isDeleted]);

  function handleDeleteBox(box_id) {
    axios.delete(`${variables.API_URL}/box/${box_id}`).then((res) => {
      toast({
        title: res.data.msg,
        status: "success",
        isClosable: true,
        duration: 2000,
      });
      setisDeleted(true);
    });
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth={"container.lg"}>
        <Flex
          justifyContent={"space-between"}
          px={3}
          py={2}
          borderColor="gray.500"
          borderBottom
          borderBottomWidth={2}
        >
          <Heading size={"lg"} color="gray.600">
            จัดการกล่อง
          </Heading>
          <Link to={"/box/create"}>
            <Button
              leftIcon={<PlusSquareIcon />}
              variant="outline"
              colorScheme={"green"}
            >
              เพิ่มกล่อง
            </Button>
          </Link>
        </Flex>
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>กล่อง</Th>
                <Th>วันที่สร้าง</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {boxList
                .sort((a, b) => a.box - b.box)
                .map((data, idx) => (
                  <Tr key={data.box}>
                    <Td>{idx + 1}</Td>
                    <Td>{data.box}</Td>
                    <Td>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                    <Td display="inline-block">
                      <DeleteIcon
                        w={4}
                        h={4}
                        color="red"
                        _hover={{ color: "red.300" }}
                        onClick={() => handleDeleteBox(data._id)}
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}

export default StdBox