import React, { useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "../Navbar/Navbar";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import axios from "axios";

function UserEdit() {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { _id, name, role, department } = location.state;
  const [isLoading, setisLoading] = useState(false);
  const [isBtnLoading, setisBtnLoading] = useState(false);
  const [deptList, setdeptList] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: name,
      role: role,
      department: department,
    },
  });

  useEffect(() => {
    axios.get(`${API_URL}/department`).then((res) => {
      if (res.data) {
        setdeptList(res.data);
        setisLoading(false);
      }
    });

    return () => {
      setdeptList([]);
    };
  }, []);

  const onSubmit = (data) => {
    setisBtnLoading(true);
    axios
      .put(`${API_URL}/users/${_id}`, data)
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้าก่อนหน้า",
            status: "success",
            duration: 2000,
            onCloseComplete: () => {
              navigate(-1);
              setisBtnLoading(false);
            },
          });
          return;
        }
      })
      .catch((err) => {
        if (err) {
          setisBtnLoading(false);
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถอัพเดทข้อมูล",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
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
            <EditIcon />
            แก้ไขผู้ใช้
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
                  placeholder={department}
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
            <Flex gap={3}>
              <Button
                leftIcon={<EditIcon />}
                variant={"solid"}
                colorScheme={"messenger"}
                type="submit"
                isLoading={isBtnLoading}
                loadingText="กำลังเพิ่มผู้ใช้"
              >
                แก้ไข
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

export default UserEdit;
