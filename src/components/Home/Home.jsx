import {
  Button,
  Container,
  Flex,
  Stack,
  StackItem,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

function Home() {
  const [programMode, setprogramMode] = useState("");
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  function handleButtonClick(e) {
    const value = e.target.value;
    console.log(value);
    switch (value) {
      case "Store S":
        setprogramMode("Store S");
        localStorage.setItem("program", "Store S");
        break;
      case "Store B":
        setprogramMode("Store B");
        localStorage.setItem("program", "Store B");
        break;
      case "จัด STD":
        setprogramMode("จัด STD");
        localStorage.setItem("program", "จัด STD");
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    //Check programMode and navigate to those program
    switch (programMode) {
      case "Store S":
        navigate("/store-s");
        break;
      case "Store B":
        navigate("/store-b");
        break;
      case "จัด STD":
        navigate("/std");
        break;
      default:
        break;
    }
  }, [programMode]);

  return (
    <Flex
      justifyContent={"center"}
      h={"100vh"}
      alignItems="center"
      bgColor="gray.300"
    >
      <Stack
        gap={5}
        direction={{ base: "column", sm: "column", md: "row", lg: "row" }}
      >
        {[
          { name: "Store S", color: "orange" },
          { name: "Store B", color: "orange" },
          { name: "จัด STD", color: "orange" },
        ].map((data) => {
          return (
            <StackItem key={data.name}>
              <Button
                size={"lg"}
                p={20}
                bgColor={data.color}
                _hover={{ bgColor: "orange.500" }}
                value={data.name}
                onClick={(e) => handleButtonClick(e)}
                fontSize="2xl"
              >
                {data.name}
              </Button>
            </StackItem>
          );
        })}
      </Stack>
    </Flex>
  );
}

export default Home;
