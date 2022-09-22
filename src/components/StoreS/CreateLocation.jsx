import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
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
import { variables } from "../../Variables";
import Navbar from "../Navbar/Navbar";
import { BiPlus } from "react-icons/bi";

function CreateLocation() {
  const [zoneList, setzoneList] = useState([]);
  const [locList, setlocList] = useState([]);
  const [channelList, setchannelList] = useState([]);
  const [scanjobList, setscanjobList] = useState([]);
  const [selectedZone, setselectedZone] = useState(0);
  const [selectedChannel, setselectedChannel] = useState(0);
  const [scanInputErrMsg, setscanInputErrMsg] = useState("");
  const [progress, setprogress] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  let inputRef = useRef();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios.get(variables.API_URL + "location").then((res) => {
      setlocList(res.data);
    });
    axios.get(variables.API_URL + "zone").then((res) => {
      setzoneList(res.data);
    });

    axios.get(variables.API_URL + "channel").then((res) => {
      setchannelList(res.data);
    });
  }, []);

  function handleScanJob(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      inputRef.current.select();
      let str = e.target.value;
      str = str.split("+");
      if (str.length !== 2) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "รูปแบบข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ QR Code",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      let createItemObj = {
        zone: selectedZone,
        ch: parseInt(selectedChannel),
        job: str[0],
        item: str[1],
      };
      const jobExist = scanjobList?.find((list) => list.job === str[0]);
      const jobLocExist = locList?.find((list) => list.job === str[0]);
      if (jobLocExist) {
        toast({
          title: "job นี้มีในระบบอยู่แล้ว",
          status: "error",
          duration: 3000,
        });
      }
      if (!jobExist && !jobLocExist) {
        const tempList = scanjobList.concat(createItemObj);
        setscanjobList(tempList);
        console.log(scanjobList);
        return;
      }
      console.log("job exist");
    }
  }

  function handleProcess() {
    console.log(scanjobList);
    let count = 0;
    setisLoading(true);
    scanjobList.forEach((data) => {
      axios.post(variables.API_URL + "location", data, {
        onUploadProgress: () => {
          count++;
          const progressPercent = (count / previewList.length) * 100;
          setprogress(progressPercent);
        },
      });

      console.log(progress);
      if (progress === 100) {
        onClose();
        toast({
          title: "เพิ่มข้อมูลใหม่สำเร็จ",
          status: "success",
          duration: 3000,
        });
        setisLoading(false);
        setscanjobList([]);
      }
    });
  }

  return (
    <Box>
      <Navbar />

      <Container
        maxWidth={{
          base: "container.xl",
          lg: "container.lg",
          md: "container.md",
          sm: "container.sm",
        }}
      >
        <Heading color={"gray.600"} mt={5} mb={3}>
          <PlusSquareIcon />
          เพิ่ม Item
        </Heading>

        <Divider border borderColor={"gray.600"} />

        <Stack spacing={5} mt={3}>
          <Flex gap={5} alignItems="center">
            <Text>โซน: </Text>
            <ButtonGroup spacing={6} variant="solid">
              {zoneList
                .sort((a, b) => a.zone - b.zone)
                .map((zone) => (
                  <Button
                    key={zone.zone}
                    bgColor={selectedZone === zone.zone ? "#C6A477" : "#ECD59F"}
                    onClick={() => setselectedZone(zone.zone)}
                  >
                    {zone.zone === 99 ? "อื่นๆ" : zone.zone}
                  </Button>
                ))}
            </ButtonGroup>
          </Flex>

          <Flex gap={5} alignItems={"center"} w="sm">
            <Text>ช่อง: </Text>
            <FormControl>
              <Select
                placeholder="เลือกช่อง"
                bgColor={"#ECD59F"}
                onChange={(e) => setselectedChannel(e.target.value)}
              >
                {channelList
                  .sort((a, b) => a.ch - b.ch)
                  .map((ch) => (
                    <option value={ch.ch} key={ch.ch}>
                      {ch.ch}
                    </option>
                  ))}
              </Select>
            </FormControl>
          </Flex>

          <Divider borderWidth={1} borderColor="gray.600" />

          {selectedZone && selectedChannel > 0 ? (
            <Box>
              <FormControl>
                <FormLabel>Scan Job</FormLabel>
                <Input
                  type={"text"}
                  bgColor="#D3E7EE"
                  ref={inputRef}
                  onKeyDown={(e) => handleScanJob(e)}
                  onKeyPress={(e) => handleScanJob(e)}
                  autoFocus
                />
              </FormControl>
              <Divider borderWidth={1} borderColor="gray.600" my={5} />
              <TableContainer overflowY={"auto"}>
                <Table variant={"striped"} size="md">
                  <TableCaption>
                    Job ทั้งหมด :{" "}
                    <Badge colorScheme={"purple"}>{scanjobList.length}</Badge>
                  </TableCaption>
                  <Thead>
                    <Tr>
                      <Th w="7%">ลำดับ</Th>
                      <Th>โซน</Th>
                      <Th>ช่อง</Th>
                      <Th>Job</Th>
                      <Th>Item</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {scanjobList.map((item, idx) => (
                      <Tr key={item.job}>
                        <Td>{idx + 1}</Td>
                        <Td>{item.zone}</Td>
                        <Td>{item.ch}</Td>
                        <Td>{item.job}</Td>
                        <Td>{item.item}</Td>
                        <Td>
                          <DeleteIcon
                            w={4}
                            h={4}
                            color="red.500"
                            _hover={{ color: "red.300" }}
                            onClick={() => handleScanJobListDelete()}
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
                disabled={scanjobList.length > 0 ? false : true}
              >
                เพิ่ม Item ทั้งหมด
              </Button>
            </Box>
          ) : (
            <Alert status="info" variant={"left-accent"}>
              <AlertIcon />
              <AlertTitle>
                กรุณาเลือกโซนและช่องให้ครบถ้วนก่อนสแกน job
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

export default CreateLocation;
