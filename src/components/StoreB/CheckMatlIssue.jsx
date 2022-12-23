import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { MdRefresh, MdSave } from "react-icons/md";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import AuthContext from "../../Context/AuthContext";
import pass from "../../assets/sounds/ผ่าน.mp3";
import notPass from "../../assets/sounds/ไม่ผ่าน.mp3";

function CheckMatlIssue() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobMatlList, setjobMatlList] = useState([]);
  const [scanList, setscanList] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [isBtnSaveLoading, setisBtnSaveLoading] = useState(false);
  const [scanResult, setscanResult] = useState(null);
  const [job, setjob] = useState("");
  const inputRefList = useRef({});
  const jobInputRef = useRef(null);
  const toast = useToast();
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (isLoaded) {
      inputRefList.current?.focus();
    }
  }, [isLoaded]);
  useMemo(() => renderColorByStatus, [inputRefList]);

  function handleJobScan(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      if (e.target.value === "") {
        setjobInputError("กรุณาสแกนหมายเลข Job!");
        return;
      }

      setjob(e.target.value);

      axios
        .get(`http://192.168.2.13/api/getjobmatl/${e.target.value}`)
        .then((res) => {
          if (res.data.length) {
            let tempList = res.data;
            tempList.forEach((job) => (job.item = job.item.replace("-E", "")));
            setjobMatlList(tempList);
            return;
          }
          e.preventDefault();
          jobInputRef.current.select();
          toast({
            title: "ไม่พบข้อมูล",
            description: "กรุณาตรวจสอบหมายเลข job",
            status: "error",
            isClosable: true,
          });
        });
      setTimeout(() => {
        setisLoaded(true);
      }, 1000);
    }
  }

  function handleItemScan(e) {
    let audioPass = new Audio(pass);
    let audioNotPass = new Audio(notPass);
    if (e.keyCode === 9 || e.charCode === 13) {
      const refList = Object.values(inputRefList.current).map(
        (val) => val.value
      );
      let itemTemp = e.target.value;

      //remove -E
      itemTemp = itemTemp.toUpperCase();
      itemTemp = itemTemp.replace("-E", "");

      e.preventDefault();
      inputRefList.current.select();
      // console.log(jobMatlList[0].item, itemTemp);
      if (!jobMatlList.find((job) => job.item === itemTemp)) {
        audioNotPass.play();
        // Insert to List to display status
        setscanList((current) => [
          ...current,
          { item: itemTemp, status: false },
        ]);
        setscanResult("NG");
        setTimeout(() => {
          setscanResult(null);
        }, 2000);
        return;
      }
      audioPass.play();
      setscanList((current) => [...current, { item: itemTemp, status: true }]);
      setscanResult("OK");
      setTimeout(() => {
        setscanResult(null);
      }, 2000);
    }
  }

  function createJobTransactions() {
    setisBtnSaveLoading(true);
    console.log(scanList, authCtx.userData);
    const jobTransObj = {
      job,
      item_matl: scanList,
      created_by: authCtx.userData?._id,
    };
    axios
      .post(`${API_URL}/jobtrans/`, jobTransObj)
      .then((res) => {
        handleResetBtnClick();
        toast({
          title: res.data.msg,
          status: "success",
          duration: 3000,
        });
      })
      .catch((err) => {
        if (err.response.status in [500, 400]) {
          toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถบันทึกข้อมูล",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      });
  }

  function handleResetBtnClick() {
    jobInputRef.current.value = "";
    jobInputRef.current.focus();
    setjobMatlList([]);
    setisLoaded(false);
    setscanList([]);
    setjob("");
    setisBtnSaveLoading(false);
    setscanResult(null);
  }

  function renderColorByStatus(input_item, type) {
    let itemInput = input_item;
    itemInput = itemInput?.replace("-E", "");
    const tempJob = jobMatlList.find(({ item }) => item === itemInput);

    if (!scanList.find(({ item }) => item === itemInput)) {
      if (type === "color") {
        return "gray.600";
      }
      return null;
    }
    if (!tempJob) {
      if (type === "color") {
        return "red";
      }
      return <CloseIcon />;
    }
    if (type === "color") {
      return "green";
    }
    return <CheckIcon />;
  }

  return (
    <Box>
      <Navbar />

      <Container
        maxWidth={{
          sm: "container.sm",
          md: "container.md",
          lg: "container.lg",
        }}
        h="full"
      >
        <Stack alignItems={"center"} spacing={5}>
          <FormControl>
            <FormLabel color={"gray.600"}>สแกนหมายเลข Job</FormLabel>
            <Input
              ref={jobInputRef}
              type={"text"}
              autoFocus
              onKeyDown={(e) => handleJobScan(e)}
              onKeyPress={(e) => handleJobScan(e)}
              maxLength={10}
            />
          </FormControl>

          <Divider borderColor={"gray.600"} />

          {job ? (
            <Skeleton isLoaded={isLoaded} w={"full"}>
              <FormControl>
                <InputGroup>
                  <Input
                    ref={inputRefList}
                    color={
                      scanResult
                        ? scanResult === "OK"
                          ? "green"
                          : "red"
                        : "gray.700"
                    }
                    borderColor={
                      scanResult
                        ? scanResult === "OK"
                          ? "green"
                          : "red"
                        : "gray.200"
                    }
                    bgColor={
                      scanResult
                        ? scanResult === "OK"
                          ? "green.100"
                          : "red.100"
                        : "white"
                    }
                    autoFocus
                    type={"text"}
                    onKeyDown={(e) => handleItemScan(e)}
                    onKeyPress={(e) => handleItemScan(e)}
                    transitionDuration={"1000ms"}
                  />
                  <InputRightElement
                    children={
                      scanResult ? (
                        scanResult === "OK" ? (
                          <CheckIcon color={"green"} />
                        ) : (
                          <CloseIcon color={"red"} />
                        )
                      ) : null
                    }
                  />
                </InputGroup>
              </FormControl>
            </Skeleton>
          ) : null}
          {scanList.length > 0 ? (
            <Stack spacing={3} w="full">
              <List spacing={2} fontSize='sm'>
                {scanList.map(({ item, status }, idx) => {
                  return (
                    <ListItem
                      key={item}
                      display="flex"
                      justifyContent={"space-between"}
                      alignItems='center'
                      px={5}
                    >
                      <Text>{idx + 1}. {item}</Text>
                      <Text
                        color={status ? "green.600" : "red.600"}
                        bgColor={status ? "green.100" : "red.100"}
                        rounded="md"
                        py={1}
                        px={4}
                        fontWeight='semibold'
                      >
                        {status ? "OK" : "NG"}
                      </Text>
                    </ListItem>
                  );
                })}
              </List>
            </Stack>
          ) : null}
          <Box
            w="full"
            display={"flex"}
            flexDirection={{ sm: "column", md: "row", lg: "row", xl: "row" }}
            gap={3}
          >
            <Button
              w={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
              leftIcon={<MdSave />}
              variant="solid"
              colorScheme={"teal"}
              isLoading={isBtnSaveLoading}
              loadingText="กำลังบันทึก"
              onClick={createJobTransactions}
              disabled={job.length > 0 ? false : true}
            >
              บันทึก
            </Button>
            <Button
              w={{ base: "100%", sm: "100%", md: "50%", lg: "50%", xl: "50%" }}
              variant={"outline"}
              colorScheme="twitter"
              leftIcon={<MdRefresh size="1.2em" />}
              onClick={handleResetBtnClick}
            >
              รีเซ็ต
            </Button>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default CheckMatlIssue;
