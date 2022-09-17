import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  StackItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { variables } from "../../Variables";
import { useForm } from "react-hook-form";
import WhseImage from "../../assets/whse-img.jpg";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [deptList, setdeptList] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios.get(variables.API_URL + "users").then((res) => {
      console.log(res.data);
      setdeptList(res.data);
    });

    // return () => {
    //   setdeptList([]);
    // };
  }, []);

  const onsubmit = (data) => {
    console.log(data);
    axios.post(variables.API_URL + "users/login", data).then((res) => {
      if (res.data.msg !== "Login User") {
        console.log(res.data.msg);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: res.data.msg,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const token = res.data.data.token;
      localStorage.setItem("token", token);
      props.setuserToken(token);
      navigate("/", { replace: true });
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onsubmit)}>
      <Flex
        flexDirection="column"
        w="100wh"
        h="100vh"
        bgImage={WhseImage}
        bgPosition="center"
        bgSize={"contain"}
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          gap={2}
          w={["sm", "md"]}
          border
          borderWidth={1}
          borderRadius={7}
          p={5}
          bgColor={"whiteAlpha.900"}
          backdropFilter="auto"
          backdropBlur="2px"

          // bgGradient="linear(to-l, #7097A8, #D3E7EE)"
        >
          <StackItem mb={2} textAlign="center">
            <Avatar />
            <Heading color="gray.700">เข้าสู่ระบบ</Heading>
          </StackItem>
          <StackItem>
            <Select
              placeholder="เลือกแผนก"
              {...register("name", { required: "กรุณาเลือกแผนก" })}
              borderColor={errors.name ? "red" : "gray.400"}
              color={errors.name ? "red" : null}
            >
              {deptList.map((data) => (
                <option value={data.name} key={data._id}>
                  {data.name}
                </option>
              ))}
            </Select>
            <Text color={"red"}>{errors.name?.message}</Text>
          </StackItem>
          <StackItem>
            <FormControl>
              <FormLabel>รหัสผ่าน</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "กรุณาใส่รหัสผ่าน",
                  minLength: {
                    value: 6,
                    message: "รหัสผ่านขั้นต่ำ 6 ตัวอักษร",
                  },
                })}
                borderColor={errors.password ? "red" : "gray.400"}
              />
              <FormHelperText color={"red"}>
                {errors.password?.message}
              </FormHelperText>
            </FormControl>
          </StackItem>
          <StackItem>
            <Button
              type="submit"
              variant="solid"
              w="full"
              bgColor="#7097A8"
              color={"white"}
              _hover={{ color: "gray.700", bgColor: "gray.200" }}
            >
              เข้าสู่ระบบ
            </Button>
          </StackItem>
        </Stack>
      </Flex>
    </form>
  );
}

export default Login;
