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
import { DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import moment from "moment";

function Channel() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [channelList, setchannelList] = useState([]);
  const toast = useToast();
  const [isDeleted, setisDeleted] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/channel`).then((res) => {
      console.log(res.data);
      setchannelList(res.data);
    });

    return () => {
      setisDeleted(false);
    };
  }, [isDeleted]);

  function handleDeleteChannel(ch_id) {
    axios.delete(`${API_URL}/channel/${ch_id}`).then((res) => {
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
          <Heading size={"lg"}>จัดการช่อง</Heading>
          <Link to={"/channel/create"}>
            <Button
              leftIcon={<PlusSquareIcon />}
              variant="outline"
              colorScheme={"green"}
            >
              เพิ่มช่อง
            </Button>
          </Link>
        </Flex>
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>ช่อง</Th>
                <Th>วันที่สร้าง</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {channelList
                .map((data, idx) => (
                  <Tr key={data.ch}>
                    <Td>{idx + 1}</Td>
                    <Td>{data.ch}</Td>
                    <Td>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                    <Td display="inline-block">
                      <DeleteIcon
                        w={4}
                        h={4}
                        color="red"
                        _hover={{ color: "red.300" }}
                        onClick={() => handleDeleteChannel(data._id)}
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

export default Channel;
