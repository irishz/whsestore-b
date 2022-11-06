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
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
function STDHome() {
  const navigate = useNavigate();
  const [scanInput, setscanInput] = useState("");
  const [locList, setlocList] = useState([]);
  const [boxList, setboxList] = useState([]);
  const [layerList, setlayerList] = useState([]);

  useEffect(() => {
    axios.get(`${variables.API_URL}/location`).then((res) => {
      setlocList(res.data);
    });
    axios.get(`${variables.API_URL}/box`).then((res) => {
      setboxList(res.data);
    });
    axios.get(`${variables.API_URL}/layer`).then((res) => {
      setlayerList(res.data);
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

export default STDHome;
