import React, { useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

function LocCompare() {
  const [itemLocInput, setitemLocInput] = useState("");
  const [itemLocLabel, setitemLocLabel] = useState("");
  const [isVisible, setisVisible] = useState(false);
  const itemLocRef = useRef(null);

  function handleItemLabelScan(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      e.preventDefault();
      if (itemLocInput.toLowerCase() === itemLocLabel.toLowerCase()) {
        setisVisible(true);
        setTimeout(() => {
          setisVisible(false);
          setitemLocInput("");
          setitemLocLabel("");
          itemLocRef.current.select();
        }, 1000);
        return;
      }
      setisVisible(true);
      setTimeout(() => {
        setisVisible(false);
        setitemLocInput("");
        setitemLocLabel("");
        itemLocRef.current.select();
      }, 3000);
    }
  }

  return (
    <Box>
      <Navbar />

      <Container maxW={"container.sm"}>
        <VStack>
          <FormControl>
            <FormLabel htmlFor="item_loc">Item Location</FormLabel>
            <Input
              ref={itemLocRef}
              type="text"
              id="item_loc"
              autoFocus
              onChange={(e) => setitemLocInput(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="item_label">Item Label</FormLabel>
            <Input
              type="text"
              id="item_label"
              onChange={(e) => setitemLocLabel(e.target.value)}
              onKeyDown={(e) => handleItemLabelScan(e)}
              onKeyPress={(e) => handleItemLabelScan(e)}
            />
          </FormControl>
          {isVisible ? (
            <Box boxShadow={"2xl"}>
              <Text
                py={7}
                px={10}
                fontWeight={"bold"}
                fontSize={36}
                color="white"
                bgColor={
                  itemLocInput.toLowerCase() === itemLocLabel.toLowerCase()
                    ? "green"
                    : "red"
                }
                rounded="md"
              >
                {itemLocInput.toLowerCase() === itemLocLabel.toLowerCase()
                  ? "OK"
                  : "NG"}
              </Text>
            </Box>
          ) : null}
        </VStack>
      </Container>
    </Box>
  );
}

export default LocCompare;
