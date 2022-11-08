import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsPersonPlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function UserCreate() {
  const [deptList, setdeptList] = useState([]);
  const [isBtnLoading, setisBtnLoading] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    axios.get(`${API_URL}/department`).then((res) => {
      if (res.data) {
        setdeptList(res.data);
        setisLoading(false);
      }
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: 0,
      department: "",
    },
  });

  const onSubmit = (data) => {
    setisBtnLoading(true);
    data.password = "123123";
    console.log(data);
    axios.post(`${API_URL}/users`, data).then((res) => {
       const {msg} = res.data
      if (res.status === 201) {
        setisBtnLoading(false);
        toast({
          title: msg,
          description: "กำลังกลับไปยังหน้าก่อนหน้า...",
          status: "success",
          duration: "2000",
          onCloseComplete: () => {
            navigate(-1);
          },
        });
        return;
      }
      toast({
        title: "เกิดข้อผิดพลาด",
        description: msg,
        status: "error",
        isClosable: true,
        onCloseComplete: setisBtnLoading(false),
      });
    });
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth={"container.lg"}>
        <Flex>
          <Heading
            display={"inline-flex"}
            alignItems="center"
            fontSize={28}
            color="gray.600"
            gap={2}
          >
            <BsPersonPlusFill />เพิ่มผู้ใช้
          </Heading>
        </Flex>
        <Divider my={2} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack w={"60%"} spacing={2}>
            <Skeleton isLoaded={!isLoading}>
              <FormControl _invalid={{ borderColor: "tomato" }}>
                <FormLabel>ชื่อผู้ใช้งาน</FormLabel>
                <Input
                  {...register("name", { required: "กรุณาใส่ชื่อผู้ใช้งาน" })}
                  type="text"
                />
                <FormHelperText color={"tomato"}>
                  {errors.name?.message}
                </FormHelperText>
              </FormControl>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <FormControl>
                <FormLabel>ประเภท</FormLabel>
                <Select {...register("role")}>
                  <option value={0}>พนักงาน</option>
                  <option value={1}>admin</option>
                </Select>
              </FormControl>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <FormControl>
                <FormLabel>แผนก</FormLabel>
                <Select
                  {...register("department", { required: "กรุณาเลือกแผนก" })}
                >
                  {deptList.length > 1
                    ? deptList.map((dept) => (
                        <option key={dept.department}>{dept.department}</option>
                      ))
                    : null}
                </Select>
                <FormHelperText color={"tomato"}>
                  {errors.department?.message}
                </FormHelperText>
              </FormControl>
            </Skeleton>
            <Flex gap={3}>
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                type="submit"
                isLoading={isBtnLoading}
                loadingText="กำลังเพิ่มผู้ใช้"
              >
                เพิ่มผู้ใช้
              </Button>
              <Button colorScheme={"gray"} onClick={() => navigate(-1)}>
                ย้อนกลับ
              </Button>
            </Flex>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

export default UserCreate;
