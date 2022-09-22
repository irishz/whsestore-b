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

function Zone() {
  const [zoneList, setzoneList] = useState([]);
  const toast = useToast();
  const [isDeleted, setisDeleted] = useState(false);

  useEffect(() => {
    axios.get(variables.API_URL + "zone").then((res) => {
      console.log(res.data);
      setzoneList(res.data);
    });

    return () => {
      setisDeleted(false);
    };
  }, [isDeleted]);

  function handleDeleteZone(zone_id) {
    axios.delete(variables.API_URL + `zone/${zone_id}`).then((res) => {
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
            จัดการโซน
          </Heading>
          <Link to={"/zone/create"}>
            <Button
              leftIcon={<PlusSquareIcon />}
              variant="outline"
              colorScheme={"green"}
            >
              เพิ่มโซน
            </Button>
          </Link>
        </Flex>
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>ลำดับ</Th>
                <Th>โซน</Th>
                <Th>วันที่สร้าง</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {zoneList
                .map((data, idx) => (
                  <Tr key={data.zone}>
                    <Td>{idx + 1}</Td>
                    <Td>{data.zone}</Td>
                    <Td>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                    <Td display="inline-block">
                      <DeleteIcon
                        w={4}
                        h={4}
                        color="red"
                        _hover={{ color: "red.300" }}
                        onClick={() => handleDeleteZone(data._id)}
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

export default Zone;
