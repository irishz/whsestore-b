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
  const API_URL = import.meta.env.VITE_API_URL;
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
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      role: 0,
      department: "",
      password: "",
      confirmPass: "",
    },
  });

  const onSubmit = (data) => {
    setisBtnLoading(true);
    console.log(data);
    axios.post(`${API_URL}/users`, data).then((res) => {
      const { msg } = res.data;
      const status = [200, 201];
      if (status.includes(res.status)) {
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
            <BsPersonPlusFill />
            เพิ่มผู้ใช้
          </Heading>
        </Flex>
        <Divider my={2} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack w={"60%"} spacing={2}>
            <Skeleton isLoaded={!isLoading}>
              <FormControl
                isInvalid={errors.name}
                _invalid={{ bgColor: "teal" }}
              >
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
                  isInvalid={errors.department}
                  {...register("department", { required: "กรุณาเลือกแผนก" })}
                >
                  {deptList.length > 1 &&
                    deptList.map((dept) => (
                      <option key={dept.department}>{dept.department}</option>
                    ))}
                </Select>
                <FormHelperText color={"tomato"}>
                  {errors.department?.message}
                </FormHelperText>
              </FormControl>
            </Skeleton>
            <Divider />

            <Flex gap={3}>
              <Skeleton isLoaded={!isLoading} w="full">
                <FormControl>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <Input
                    isInvalid={errors.password}
                    {...register("password", {
                      required: "กรุณาใส่รหัสผ่าน",
                      minLength: {
                        value: 6,
                        message: "รหัสผ่านขั้นต่ำ 6 ตัวอักษร",
                      },
                    })}
                    type={"password"}
                    placeholder="******"
                  />
                  <FormHelperText color={"tomato"}>
                    {errors.password?.message}
                  </FormHelperText>
                </FormControl>
              </Skeleton>
              <Skeleton isLoaded={!isLoading} w="full">
                <FormControl>
                  <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                  <Input
                    {...register("confirmPass", {
                      validate: (value) =>
                        watch("password") === value || "รหัสผ่านไม่ตรงกัน",
                    })}
                    type={"password"}
                    placeholder="******"
                  />
                  <FormHelperText color={"tomato"}>
                    {errors.confirmPass?.message}
                  </FormHelperText>
                </FormControl>
              </Skeleton>
            </Flex>
            <Flex gap={3}>
              <Skeleton isLoaded={!isLoading}>
                <Button
                  variant={"solid"}
                  colorScheme={"teal"}
                  type="submit"
                  isLoading={isBtnLoading}
                  loadingText="กำลังเพิ่มผู้ใช้"
                >
                  เพิ่มผู้ใช้
                </Button>
              </Skeleton>
              <Skeleton isLoaded={!isLoading}>
                <Button colorScheme={"gray"} onClick={() => navigate(-1)}>
                  ย้อนกลับ
                </Button>
              </Skeleton>
            </Flex>
          </Stack>
        </form>
      </Container>
    </Box>
  );
}

export default UserCreate;
