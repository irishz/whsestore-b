import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function ZoneCreate() {
  const API_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      zone: "",
    },
  });
  const toast = useToast();

  function onsubmit(data) {
    axios.post(`${API_URL}/zone`, data).then((res) => {
      // console.log(res.data.msg);
      if (res.data.msg === "zone นี้มีในระบบอยู่แล้ว") {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: res.data.msg,
          status: "error",
          isClosable: true,
          duration: 3000,
        });
        return;
      }
      toast({
        title: res.data.msg,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
      navigate(-1);
    });
    // console.log(data);
  }

  return (
    <Box>
      <Navbar />

      <Container maxW={"2xl"} mt={5} pb={2} borderBottom borderBottomWidth={1}>
        <Text>เพิ่มโซน</Text>
      </Container>

      <Box>
        <VStack>
          <form noValidate onSubmit={handleSubmit(onsubmit)}>
            <FormControl my={3}>
              <FormLabel>หมายเลขโซน: </FormLabel>
              <Input
                {...register("zone", { required: "กรุณาใส่หมายเลขโซน" })}
                type={"number"}
                borderColor={errors.zone ? "red" : "gray.300"}
              />
              <FormHelperText color={"red"}>
                {errors.zone?.message}
              </FormHelperText>
            </FormControl>
            <Flex gap={3}>
              <Button colorScheme={"teal"} variant="solid" type="submit">
                เพิ่มโซน
              </Button>
              <Button
                colorScheme={"red"}
                variant="solid"
                onClick={() => navigate(-1)}
              >
                ยกเลิก
              </Button>
            </Flex>
          </form>
        </VStack>
      </Box>
    </Box>
  );
}

export default ZoneCreate;
