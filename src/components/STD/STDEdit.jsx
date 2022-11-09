import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function STDEdit() {
  const API_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();
  const { _id, item, box, layer, createdAt } = location.state;
  const [boxList, setboxList] = useState([]);
  const [layerList, setlayerList] = useState([]);
  const navigate = useNavigate();
  const [isEditBtnLoading, setisEditBtnLoading] = useState(false);
  const toast = useToast();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      box: box,
      layer: layer,
    },
  });

  useEffect(() => {
    axios.get(`${API_URL}/box`).then((res) => setboxList(res.data));
    axios.get(`${API_URL}/layer`).then((res) => setlayerList(res.data));
  }, []);

  const onSubmit = (data) => {
    console.log(data);
    setisEditBtnLoading(true);

    axios
      .put(`${API_URL}/location-std/${_id}`, data)
      .then((res) => {
        if ((res.status = 200)) {
          toast({
            title: res.data.msg,
            description: "กำลังกลับไปยังหน้าก่อนหน้า",
            status: "success",
            duration: 2000,
            onCloseComplete: () => navigate(-1),
          });
        }
      })
      .catch((err) => {
        if (err) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถอัพเดทข้อมูล",
            status: 'error',
            duration: 3000,
            isClosable: true
        });
        }
      });
  };

  return (
    <Box>
      <Navbar />

      <Container
        maxW={{ base: "container.sm", md: "container.md", lg: "container.lg" }}
      >
        <Heading color={"gray.600"} mb={5}>
          <EditIcon />
          แก้ไข Item: {item}
        </Heading>

        <Flex gap={5} my={5}>
          {/* Item */}
          <FormControl>
            <FormLabel>Item</FormLabel>
            <Input type={"text"} readOnly value={item} bgColor="gray.200" />
          </FormControl>
          {/* createdAt */}
          <FormControl>
            <FormLabel>สร้างเมื่อ</FormLabel>
            <Input
              type={"text"}
              readOnly
              value={moment(createdAt).format("LLL")}
              bgColor="gray.200"
            />
          </FormControl>
        </Flex>
        <Divider my={3} />
        <form noValidate onSubmit={handleSubmit(onSubmit)} id="edit-form">
          <Flex gap={5}>
            <FormControl>
              <FormLabel>กล่อง</FormLabel>
              <Skeleton isLoaded={boxList.length > 0 && true}>
                <Select {...register("box")}>
                  {boxList.map(({ box }) => (
                    <option key={box} value={box}>
                      {box}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>
            <FormControl>
              <FormLabel>ชั้น</FormLabel>
              <Skeleton isLoaded={layerList.length > 0 && true}>
                <Select {...register("layer")}>
                  {layerList.map(({ layer }) => (
                    <option key={layer} value={layer}>
                      {layer}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>
          </Flex>
        </form>

        <Box display={"flex"} gap={2} mt={3}>
          <Button
            type="submit"
            variant={"solid"}
            leftIcon={<EditIcon />}
            colorScheme={"teal"}
            form="edit-form"
            isLoading={isEditBtnLoading}
            loadingText="กำลังอัพเดท"
          >
            แก้ไข
          </Button>
          <Button
            variant={"solid"}
            colorScheme={"red"}
            onClick={() => navigate(-1)}
          >
            ย้อนกลับ
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default STDEdit;
