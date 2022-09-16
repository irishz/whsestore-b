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
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { variables } from "../../Variables";
import Navbar from "../Navbar/Navbar";

function StoreSHome() {
  const [scanInput, setscanInput] = useState("");
  const [locList, setlocList] = useState([]);
  const [zoneList, setzoneList] = useState([]);
  const [historyList, sethistoryList] = useState([]);
  const [chList, setchList] = useState([]);

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

    return () => {
      setlocList([]);
      setzoneList([]);
      setchList([]);
    };
  }, []);

  useEffect(() => {
    const jobExisted = historyList.find((job) => job === scanInput);
    if (!jobExisted) {
      console.log("inserted to history");
      sethistoryList(historyList.push(scanInput));
    }
  }, [scanInput]);

  function renderLocationData(zone, ch) {
    return locList.filter((loc) => loc.zone === zone && loc.ch === ch);
  }

  function handleScanInput(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      setscanInput(e.target.value);
    }
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
            <Input
              type={"text"}
              maxLength={10}
              onKeyDown={(e) => handleScanInput(e)}
              onKeyPress={(e) => handleScanInput(e)}
            />
          </FormControl>
        </Box>

        {scanInput.length > 0 ? (
          locList
            .filter((loc) => loc.job === scanInput)
            .map((loc) => (
              <Flex h={"sm"} gap={3}>
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
                </Flex>
                <Box
                  flex={1}
                  rounded="lg"
                  border
                  borderWidth={1}
                  borderColor="gray.400"
                >
                  <VStack>
                    <Box
                      p={2}
                      borderBottomWidth={1}
                      borderColor="gray.400"
                      w="100%"
                    >
                      <Text textAlign={"center"}>ประวัติการสแกน</Text>
                    </Box>
                    <Box w="100%" p={3}>
                      <OrderedList spacing={2}>
                        {historyList.map((data) => (
                          <ListItem>{data}</ListItem>
                        ))}
                      </OrderedList>
                    </Box>
                  </VStack>
                </Box>
              </Flex>
            ))
        ) : (
          // .map((loc) => (
          // <Flex h={"xl"} gap={3}>
          //   <Box flex={1} bgColor="red">
          //     <Box>{loc.zone}</Box>
          //   </Box>
          //   <Box flex={1} bgColor="green">
          //     {loc.ch}
          //   </Box>
          //   <Box flex={1} bgColor="blue">
          //     3
          //   </Box>
          // </Flex>
          // ))
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
