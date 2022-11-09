import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  ListItem,
  OrderedList,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { RiRefreshLine } from "react-icons/ri";
import Navbar from "../Navbar/Navbar";

function STDHome() {
  const [scanInput, setscanInput] = useState("");
  const [locList, setlocList] = useState([]);
  const [boxList, setboxList] = useState([]);
  const [layerList, setlayerList] = useState([]);
  const inputRef = useRef();
  const API_URL = import.meta.env.VITE_API_URL;
  const toast = useToast();

  useEffect(() => {
    axios.get(`${API_URL}/location-std`).then((res) => {
      setlocList(res.data);
    });
    axios.get(`${API_URL}/box`).then((res) => {
      setboxList(res.data);
    });
    axios.get(`${API_URL}/layer`).then((res) => {
      setlayerList(res.data);
    });

    return () => {
      setlocList([]);
      setboxList([]);
      setlayerList([]);
    };
  }, []);

  function handleInputClear() {
    setscanInput("");
    inputRef.current.select();
  }

  function handleScanInput(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      setscanInput(e.target.value);
      inputRef.current.select();

      toast({
        title: "ไม่พบ Item นี้ในระบบ",
        description: "กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
      });
    }
  }

  function handleScanInput(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      setscanInput(e.target.value);
      inputRef.current.select();

      // let jobLocationExist = locList.find((loc) => loc.item === e.target.value);

      // if (jobLocationExist) {
      //   playAudio(e.target.value);
      //   return;
      // }

      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ Job นี้ในระบบ",
        status: "error",
        duration: 3000,
      });
    }
  }

  function renderLocationData(box, layer) {
    return locList.filter((loc) => loc.box === box && loc.layer === layer);
  }

  return (
    <div>
      <Navbar />

      <Container maxWidth={"container.lg"}>
        <Box my={3}>
          <FormControl>
            <FormLabel fontSize={["sm", "md", "lg", "xl"]}>
              ค้นหาโดยการสแกน Item
            </FormLabel>
            <InputGroup>
              <Input
                ref={inputRef}
                type={"text"}
                onKeyDown={(e) => handleScanInput(e)}
                onKeyPress={(e) => handleScanInput(e)}
                autoFocus
              />
              {scanInput && (
                <InputRightAddon
                  children={<RiRefreshLine />}
                  as={Button}
                  onClick={() => handleInputClear()}
                />
              )}
            </InputGroup>
          </FormControl>
        </Box>

        {scanInput.length > 0 ? (
          locList
            .filter(({item}) => item === scanInput)
            .map(({item, box, layer}) => (
              <Flex h={"sm"} gap={3} key={item}>
                <Flex
                  flex={1}
                  p={3}
                  direction={"column"}
                  bgColor={"gray.200"}
                  rounded="lg"
                  shadow="lg"
                  h="full"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Heading fontSize={96}>{box}</Heading>
                  <Text>กล่อง</Text>
                </Flex>
                <Flex
                  flex={1}
                  p={3}
                  direction={"column"}
                  bgColor={"gray.200"}
                  rounded="lg"
                  shadow="lg"
                  h="full"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Heading fontSize={96}>{layer}</Heading>
                  <Text>ชั้น</Text>
                </Flex>
                <Box
                  flex={1}
                  rounded="lg"
                  border
                  borderWidth={1}
                  borderColor="gray.400"
                >
                  <Flex
                    flexDirection={"column"}
                    justifyContent="space-between"
                    h={"full"}
                  >
                    <Box p={2} borderBottomWidth={1} borderColor="gray.400">
                      <Text textAlign={"center"} fontSize="lg">
                        ประวัติการสแกน
                      </Text>
                    </Box>
                    <Box
                      py={3}
                      px={5}
                      overflowY="auto"
                      maxHeight={280}
                      h="full"
                    >
                      <OrderedList spacing={2}>
                      </OrderedList>
                    </Box>
                    <Box>
                      <Button
                        variant={"solid"}
                        colorScheme="red"
                        m={1}
                        w="97%"
                        leftIcon={<DeleteIcon />}
                        onClick={() => handleHistoryClear()}
                      >
                        ล้างประวัติการสแกน
                      </Button>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ))
        ) : (
          <Box>
            <Tabs isFitted variant={"enclosed"}>
              <TabList>
                {boxList
                  .sort((a, b) => a.box - b.box)
                  .map(({box}) =>
                    box === 99 ? (
                      <Tab key={box}>อื่นๆ</Tab>
                    ) : (
                      <Tab key={box}>กล่อง {box}</Tab>
                    )
                  )}
              </TabList>
              <TabPanels>
                {boxList
                  .sort((a, b) => a.box - b.box)
                  .map(({box}) => (
                    <TabPanel key={box}>
                      <Accordion>
                        <Grid
                          templateColumns={{
                            lg: "repeat(3, 1fr)",
                            md: "repeat(2, 1fr)",
                            sm: "repeat(1, 1fr)",
                          }}
                          gap={5}
                        >
                          {layerList.map(({layer}) => (
                            <AccordionItem key={layer}>
                              <h2>
                                <AccordionButton
                                  _expanded={{
                                    bgColor: "tomato",
                                    color: "white",
                                  }}
                                >
                                  <Box
                                    flex={1}
                                    textAlign="left"
                                    alignItems={"center"}
                                  >
                                    ชั้น: {layer}{" "}
                                    <Badge
                                      variant={"subtle"}
                                      ml={3}
                                      colorScheme="blue"
                                    >
                                      {
                                        renderLocationData(box, layer)
                                          .length
                                      }
                                    </Badge>
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <GridItem>
                                <AccordionPanel bgColor={"gray.100"}>
                                  {renderLocationData(box, layer).map(
                                    ({item}) => (
                                      <Flex mt={1} key={item}>
                                        <Text>{item}</Text>
                                      </Flex>
                                    )
                                  )}
                                </AccordionPanel>
                              </GridItem>
                            </AccordionItem>
                          ))}
                        </Grid>
                      </Accordion>
                    </TabPanel>
                  ))}
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default STDHome;
