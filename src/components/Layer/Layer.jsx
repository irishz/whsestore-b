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
import Navbar from "../Navbar/Navbar";

function Layer() {
  const [layerList, setlayerList] = useState([]);
  const toast = useToast();
  const [isDeleted, setisDeleted] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/layer`).then((res) => {
      console.log(res.data);
      setlayerList(res.data);
    });

    return () => {
      setisDeleted(false);
    };
  }, [isDeleted]);

  function handleDeleteLayer(layer_id) {
    axios.delete(`${API_URL}/layer/${layer_id}`).then((res) => {
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
            จัดการชั้น
          </Heading>
          <Link to={"/layer/create"}>
            <Button
              leftIcon={<PlusSquareIcon />}
              variant="outline"
              colorScheme={"green"}
            >
              เพิ่มชั้น
            </Button>
          </Link>
        </Flex>
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>ชั้น</Th>
                <Th>วันที่สร้าง</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {layerList
                .sort((a, b) => a.layer - b.layer)
                .map((data, idx) => (
                  <Tr key={data.layer}>
                    <Td>{idx + 1}</Td>
                    <Td>{data.layer}</Td>
                    <Td>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                    <Td display="inline-block">
                      <DeleteIcon
                        w={4}
                        h={4}
                        color="red"
                        _hover={{ color: "red.300" }}
                        onClick={() => handleDeleteLayer(data._id)}
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

export default Layer;
