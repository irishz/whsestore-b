import {
  Box,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import Navbar from "../Navbar/Navbar";
import { FaClipboardCheck } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import zoneAudio from "../../assets/sounds/zone.mp3";

function CheckOnhand() {
  const [searchInput, setsearchInput] = useState("");
  const [sumFG, setSumFG] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [locfgs, setlocfgs] = useState("");
  const [zone, setzone] = useState(null);
  const toast = useToast();

  function handleSearchInputChange(e) {
    let str = e.target.value.toString();
    if (str.includes("-E")) {
      setsearchInput(str.substring(0, str.length - 2));
    } else {
      setsearchInput(str);
    }
  }

  async function onKeyPressSearch(e) {
    let temp;
    let sum;
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      e.target.select();

      await axios
        .get(`http://192.168.2.13/api/getonhand/${searchInput}`)
        .then((res) => {
          // console.log(typeof res.data[1].qty_on_hand);
          temp = res.data;
          sum = temp.reduce(
            (count, obj) => parseInt(count) + parseInt(obj.qty_on_hand),
            0
          );

          setSumFG(sum);
          setItemList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });

      await axios
        .get(`http://192.168.2.13/api/locfgs/${searchInput}`)
        .then((res) => {
          let locstr = res.data[0].loc.toString();
          let textZone;
          // console.log(res.data);
          setlocfgs(locstr);

          if (locstr.length > 0) {
            if (
              locstr.substring(1, 4).includes("DIT") ||
              locstr.substring(1, 4).includes("FGT")
            ) {
              setzone(locstr.substring(4, 5).toUpperCase());
              textZone = locstr.substring(4, 5).toUpperCase();
            } else if (locstr.substring(1, 3).includes("CM")) {
              setzone(parseInt(locstr.substring(3, 5)));
              textZone = parseInt(locstr.substring(3, 5));
            } else {
              setzone(parseInt(locstr.substring(4, 6)));
              textZone = parseInt(locstr.substring(4, 6));
            }
            if (textZone) {
              playZone(textZone);
              return;
            }
          } else {
            setzone(null);
            toast({
              titile: "เกิดข้อผิดพลาด",
              description: "ไม่พบข้อมูล",
              status: "error",
              isClosable: true,
              duration: 3000,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  function playZone(zone) {
    console.log("play zone", zone);
    const audioSrc = new URL(`/src/assets/sounds/${zone}.mp3`, import.meta.url)

    let audioZone = new Audio(zoneAudio),
      numberZone = new Audio(audioSrc);

    setTimeout(() => {
      audioZone.play();
    }, 100);
    setTimeout(() => {
      numberZone.play();
    }, 700);
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
        <Heading color={"gray.600"} display="flex" my={5}>
          <FaClipboardCheck />
          ตรวจสอบยอดคงเหลือ & ค้นหาโซน
        </Heading>

        <FormControl>
          <FormLabel>ค้นหาโดยสแกนเลข Item</FormLabel>
          <Input
            type={"text"}
            autoFocus
            onChange={(e) => handleSearchInputChange(e)}
            placeholder="สแกน item ที่นี่..."
            onKeyDown={(e) => onKeyPressSearch(e)}
            onKeyPress={(e) => onKeyPressSearch(e)}
          />
        </FormControl>
        <Divider my={3} />
        {itemList.length > 0 ? (
          <Flex gap={5} justifyContent="space-around">
            <TableContainer
              display={"block"}
              borderWidth={1}
              p={1}
              rounded="lg"
              boxShadow={"md"}
            >
              <Table variant={"striped"} size="lg">
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>item</Th>
                    <Th>location</Th>
                    <Th textAlign={"end"}>ยอดคงเหลือ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {itemList.map(({ item, loc, qty_on_hand }, idx) => (
                    <Tr key={item}>
                      <Td>{idx + 1}</Td>
                      <Td>{item}</Td>
                      <Td>{loc}</Td>
                      <Td isNumeric>{qty_on_hand}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            <Stack
              py={3}
              px={5}
              borderWidth={1}
              rounded="md"
              boxShadow={"md"}
              w={150}
              color="gray.600"
              textAlign={"end"}
              gap={3}
            >
              <Text fontWeight="semibold">รวมทั้งหมด</Text>
              <Heading
                fontSize={sumFG.length < 3 ? "7xl" : "4xl"}
              >
                {sumFG}
              </Heading>
            </Stack>
            <Stack
              py={3}
              px={5}
              borderWidth={1}
              rounded="md"
              boxShadow={"md"}
              w={150}
              color="gray.600"
              textAlign={"end"}
              gap={3}
            >
              <Text fontWeight="semibold">โซน</Text>
              <Heading
                fontSize={zone?.length < 3 ? "7xl" : "4xl"}
              >
                {zone}
              </Heading>
            </Stack>
          </Flex>
        ) : null}
      </Container>
    </Box>
  );
}

export default CheckOnhand;
