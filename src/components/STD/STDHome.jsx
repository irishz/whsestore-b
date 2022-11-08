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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
function STDHome() {
  const navigate = useNavigate();
  const [scanInput, setscanInput] = useState("");
  const [locList, setlocList] = useState([]);
  const [boxList, setboxList] = useState([]);
  const [layerList, setlayerList] = useState([]);
  const inputRef = useRef();
  const API_URL = import.meta.env.VITE_API_URL
  console.log(API_URL)
  
  useEffect(() => {
    axios.get(`${API_URL}/location`).then((res) => {
      setlocList(res.data);
    });
    axios.get(`${API_URL}/box`).then((res) => {
      setboxList(res.data);
    });
    axios.get(`${API_URL}/layer`).then((res) => {
      setlayerList(res.data);
    });

    //Check localstorage historyScan is exist?
    const histList = localStorage.getItem("historyScan");
    if (histList) {
      sethistoryList(JSON.parse(histList));
    }

    return () => {
      setlocList([]);
      setboxList([]);
      setchList([]);
    };
  }, []);

  function handleInputClear() {
    setscanInput("");
    inputRef.current.select();
  }

  function handleHistoryClear() {
    sethistoryList([]);
    localStorage.removeItem("historyScan");
    handleInputClear();
    toast({
      title: "ล้างประวัติการสแกนแล้ว",
      status: "info",
      isClosable: true,
      duration: 2000,
    });
  }

  return (
    <div>
      <Navbar />

      <Container maxWidth={"container.lg"}>
        <Box my={3}>
          <FormControl>
            <FormLabel fontSize={["sm", "md", "lg", "xl"]}>
              ค้นหาโดยการสแกนหมายเลข Job
            </FormLabel>
            <InputGroup>
              <Input
                ref={inputRef}
                type={"text"}
                maxLength={10}
                // onKeyDown={(e) => handleScanInput(e)}
                // onKeyPress={(e) => handleScanInput(e)}
                autoFocus
              />
              {scanInput ? (
                <InputRightAddon
                  children={<RiRefreshLine />}
                  as={Button}
                  // onClick={() => handleInputClear()}
                />
              ) : null}
            </InputGroup>
          </FormControl>
        </Box>

        {scanInput.length > 0 ? (
          locList
            .filter((loc) => loc.job === scanInput)
            .map((loc) => (
              <Flex h={"sm"} gap={3} key={loc.job}>
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
                  <Heading fontSize={96}>{loc.box}</Heading>
                  <Text>โซน</Text>
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
                  <Heading fontSize={96}>{loc.ch}</Heading>
                  <Text>ช่อง</Text>
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
                        {historyList
                          ? historyList.map((data) => (
                              <ListItem key={data}>{data}</ListItem>
                            ))
                          : null}
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
                  .map((box) =>
                    box.box === 99 ? (
                      <Tab key={box.box}>อื่นๆ</Tab>
                    ) : (
                      <Tab key={box.box}>box {box.box}</Tab>
                    )
                  )}
              </TabList>
              <TabPanels>
                {boxList
                  .sort((a, b) => a.box - b.box)
                  .map((box) => (
                    <TabPanel key={box.box}>
                      <Accordion>
                        <Grid
                          templateColumns={{
                            lg: "repeat(3, 1fr)",
                            md: "repeat(2, 1fr)",
                            sm: "repeat(1, 1fr)",
                          }}
                          gap={5}
                        >
                          {chList.map((ch) => (
                            <AccordionItem key={ch.ch}>
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
                                    ช่อง: {ch.ch}{" "}
                                    <Badge
                                      variant={"subtle"}
                                      ml={3}
                                      colorScheme="blue"
                                    >
                                      {
                                        renderLocationData(box.box, ch.ch)
                                          .length
                                      }
                                    </Badge>
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <GridItem>
                                <AccordionPanel bgColor={"gray.100"}>
                                  {renderLocationData(box.box, ch.ch).map(
                                    (loc) => (
                                      <Flex mt={1} key={loc.job}>
                                        <Text>{loc.job}</Text>
                                        <Spacer />
                                        <Text>{loc.item}</Text>
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
