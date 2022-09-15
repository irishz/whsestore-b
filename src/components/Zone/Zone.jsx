import { DeleteIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
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
  const toast = useToast()

  useEffect(() => {
    axios.get(variables.API_URL + "zone").then((res) => {
      console.log(res.data);
      setzoneList(res.data);
    });
  }, [toast]);

  function handleDeleteZone(zone_id){
    axios.delete(variables.API_URL + `zone/${zone_id}`).then((res) => {
      toast({
        title: res.data.msg,
      })
    })
  }

  return (
    <Box>
      <Navbar />
      <Box maxWidth={"container.xl"} mt={5}>
        <Flex justifyContent={"space-between"} px={3}>
          <Box>จัดการโซน</Box>
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
                <Th>แก้ไขล่าสุด</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {zoneList.map((data, idx) => (
                <Tr key={data.zone}>
                  <Td>{idx + 1}</Td>
                  <Td>{data.zone}</Td>
                  <Td>{moment(data.createdAt).format("DD/MM/YYYY HH:mm")}</Td>
                  <Td>{moment(data.updatedAt).format("DD/MM/YYYY HH:mm")}</Td>
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
                      onClick={() => handleDeleteZone(data._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Zone;
