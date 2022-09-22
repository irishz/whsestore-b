import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  color,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  List,
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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { variables } from "../../Variables";
import Navbar from "../Navbar/Navbar";
import { RiRefreshLine } from "react-icons/ri";
import { DeleteIcon } from "@chakra-ui/icons";
import zoneAudio from "../../assets/sounds/zone.mp3";
import channelAudio from "../../assets/sounds/channel.mp3";

function StoreSHome() {
  const [scanInput, setscanInput] = useState("");
  const [locList, setlocList] = useState([]);
  const [zoneList, setzoneList] = useState([]);
  const [chList, setchList] = useState([]);
  const [historyList, sethistoryList] = useState([]);
  const inputRef = useRef();
  const toast = useToast();

  useEffect(() => {
    axios.get(variables.API_URL + "location").then((res) => {
      setlocList(res.data);
    });
    axios.get(variables.API_URL + "zone").then((res) => {
      setzoneList(res.data);
    });
    axios.get(variables.API_URL + "channel").then((res) => {
      setchList(res.data);
    });

    //Check localstorage historyScan is exist?
    const histList = localStorage.getItem("historyScan");
    if (histList) {
      sethistoryList(JSON.parse(histList));
    }

    return () => {
      setlocList([]);
      setzoneList([]);
      setchList([]);
    };
  }, []);

  function renderLocationData(zone, ch) {
    return locList.filter((loc) => loc.zone === zone && loc.ch === ch);
  }

  function handleScanInput(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      setscanInput(e.target.value);
      inputRef.current.select();

      let jobLocationExist = locList.find((loc) => loc.job === e.target.value);
      let jobHistoryExist = historyList.find((data) => data === e.target.value);

      if (jobHistoryExist) {
        playAudio(e.target.value);
        return;
      }
      if (jobLocationExist) {
        historyList.push(e.target.value);
        localStorage.setItem("historyScan", JSON.stringify(historyList));
        playAudio(e.target.value);
        return;
      }

      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่พบ Job นี้ในระบบ",
        status: "error",
        duration: 3000,
      });
    }
  }

  function playAudio(job) {
    const data = locList.find((loc) => loc.job === job);

    if (data) {
      playZone(data.zone);
      playChannel(data.ch);
    }
  }

  function playZone(zone) {
    console.log("play zone", zone);
    const audioSrc = `/src/assets/sounds/${zone}.mp3`;

    let audioZone = new Audio(zoneAudio),
      numberZone = new Audio(audioSrc);

    setTimeout(() => {
      audioZone.play();
    }, 100);
    setTimeout(() => {
      numberZone.play();
    }, 700);
  }

  function playChannel(channel) {
    console.log("play channel", channel);

    let audioChannel = new Audio(channelAudio),
      numberChannel = new Audio(`/src/assets/sounds/${channel}.mp3`);

    setTimeout(() => {
      audioChannel.play();
    }, 1100);
    setTimeout(() => {
      numberChannel.play();
    }, 1600);
  }

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
                onKeyDown={(e) => handleScanInput(e)}
                onKeyPress={(e) => handleScanInput(e)}
                autoFocus
              />
              {scanInput ? (
                <InputRightAddon
                  children={<RiRefreshLine />}
                  as={Button}
                  onClick={() => handleInputClear()}
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
                  <Heading fontSize={96}>{loc.zone}</Heading>
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
                {zoneList
                  .sort((a, b) => a.zone - b.zone)
                  .map((zone) =>
                    zone.zone === 99 ? (
                      <Tab key={zone.zone}>อื่นๆ</Tab>
                    ) : (
                      <Tab key={zone.zone}>Zone {zone.zone}</Tab>
                    )
                  )}
              </TabList>
              <TabPanels>
                {zoneList
                  .sort((a, b) => a.zone - b.zone)
                  .map((zone) => (
                    <TabPanel key={zone.zone}>
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
                                        renderLocationData(zone.zone, ch.ch)
                                          .length
                                      }
                                    </Badge>
                                  </Box>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <GridItem>
                                <AccordionPanel bgColor={"gray.100"}>
                                  {renderLocationData(zone.zone, ch.ch).map(
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

export default StoreSHome;
