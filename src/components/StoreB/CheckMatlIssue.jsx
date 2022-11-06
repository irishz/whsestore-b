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
  Skeleton,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, {
  createRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Navbar from "../Navbar/Navbar";
import { MdRefresh, MdSave } from "react-icons/md";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import AuthContext from "../../Context/AuthContext";
import { variables } from "../../Variables";

function CheckMatlIssue() {
  const [jobMatlList, setjobMatlList] = useState([]);
  const [scanList, setscanList] = useState([]);
  const [isLoaded, setisLoaded] = useState(false);
  const [isBtnSaveLoading, setisBtnSaveLoading] = useState(false);
  const [job, setjob] = useState("");
  const inputRefList = useRef({});
  const jobInputRef = useRef(null);
  const toast = useToast();
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (isLoaded) {
      inputRefList.current[0]?.focus();
    }
  }, [isLoaded]);
  useMemo(() => renderColorByStatus, [inputRefList]);

  function handleJobScan(e) {
    if (e.keyCode === 9 || e.charCode === 13) {
      if (e.target.value === "") {
        setjobInputError("กรุณาสแกนหมายเลข Job!");
        return;
      }

      const jobTemp = e.target.value;
      setjob(jobTemp);

      axios.get(`http://192.168.2.13/api/getjobmatl/${jobTemp}`).then((res) => {
        if (res.data.length) {
          setjobMatlList(res.data);
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

  function handleItemScan(e, idx) {
    if (e.keyCode === 9 || e.charCode === 13) {
      const refList = Object.values(inputRefList.current).map(
        (val) => val.value
      );
      const itemTemp = e.target.value;

      const itemExist = refList.filter((item) => item === itemTemp).length;
      if (
        itemExist > 1 ||
        scanList.map(({ item }) => item).includes(itemTemp)
      ) {
        e.preventDefault();
        inputRefList.current[idx].select();
        toast({
          title: `คุณได้สแกน item: ${itemTemp} ไปแล้ว`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!jobMatlList.find((job) => job.item === itemTemp)) {
        // Insert to List to display status
        setscanList((current) => [
          ...current,
          { item: itemTemp, status: false },
        ]);
        return;
      }
      setscanList((current) => [...current, { item: itemTemp, status: true }]);
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
      .post(`${variables.API_URL}/jobtrans/`, jobTransObj)
      .then((res) => {
        handleResetBtnClick()
        toast({
          title: res.data.msg,
          status: "success",
          position: "bottom-right",
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
  }

  function renderColorByStatus(input_item, type) {
    const tempJob = jobMatlList.find(({ item }) => item === input_item);

    if (!scanList.find(({ item }) => item === input_item)) {
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
          <VStack spacing={3} w="full">
            {jobMatlList.map(({ item }, idx) => (
              <Skeleton isLoaded={isLoaded} w={"full"} key={item}>
                <FormControl>
                  <InputGroup
                    color={renderColorByStatus(
                      inputRefList.current[idx]?.value,
                      "color"
                    )}
                  >
                    <Input
                      ref={(e) => {
                        inputRefList.current[idx] = e;
                      }}
                      type={"text"}
                      onKeyDown={(e) => handleItemScan(e, idx)}
                      onKeyPress={(e) => handleItemScan(e, idx)}
                      onFocus={() => inputRefList.current[idx].select()}
                    />
                    <InputRightElement
                      children={renderColorByStatus(
                        inputRefList.current[idx]?.value,
                        "icon"
                      )}
                    />
                  </InputGroup>
                </FormControl>
              </Skeleton>
            ))}
          </VStack>
          <Box
            w="full"
            display={"flex"}
            flexDirection={{ sm: "column", md: "row", lg: "row", xl: "row" }}
            gap={3}
          >
            <Button
              w="50%"
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
              w="50%"
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
