import { AiFillSetting } from "react-icons/ai";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { RiLogoutBoxLine } from "react-icons/ri";
import AuthContext from "../../Context/AuthContext";
import { variables } from "../../Variables";
import { ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const authCtx = useContext(AuthContext);
  const [userData, setuserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userTokenDecoded = jwtDecode(authCtx.userToken);

    axios
      .get(variables.API_URL + `users/${userTokenDecoded.id}`, {
        headers: {
          Authorization: `Bearer ${authCtx.userToken}`,
        },
      })
      .then((res) => {
        setuserData(res.data);
      });
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    authCtx.setuserToken("");
    authCtx.setprogram("");
  }

  function renderLeftMenuItem() {
    let StoreSMenuList,
      StoreBMenuList,
      STDMenuList = [];
    switch (authCtx.program) {
      case "Store S":
        const base_url = "/store-s";
        StoreSMenuList = [
          { menu: "เพิ่ม Item", url: `${base_url}/add-items` },
          {
            menu: "ย้าย Location",
            url: `${base_url}/move-location`,
          },
          {
            menu: "devided",
          },
          {
            menu: "Check Onhand",
            url: `${base_url}/check-onhand`,
          },
          {
            menu: "Check Onhand Other",
            url: `${base_url}/check-onhand-other`,
          },
          {
            menu: "ค้นหา Location",
            url: `${base_url}/find-location`,
          },
          {
            menu: "Compare Job",
            url: `${base_url}/compare-job`,
          },
          {
            menu: "ยิงครบ Job",
            url: `${base_url}/check-fulljob`,
          },
        ];

        return StoreSMenuList.map((data) => <MenuItem>{data.menu}</MenuItem>);
        break;
      case "Store B":
        break;
      case "Store STD":
        break;
      default:
        break;
    }
  }

  return (
    <Flex
      justify={"space-between"}
      p={3}
      bgColor={"#7097A8"}
      color="white"
      alignItems={"center"}
    >
      {/* Left Menu */}
      <Box display={{ lg: "block", sm: "none" }}>MenuToggle</Box>
      {/* Right Menu */}
      <Box display={"inline-flex"} gap={3} alignItems="center">
        <Text>{userData.name}</Text>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            _hover={{
              bgColor: "#ECD59F",
              color: "gray.600",
              borderColor: "#ffefaa",
            }}
            _active={{
              bgColor: "#ECD59F",
              color: "gray.600",
              borderColor: "#ffefaa",
            }}
          >
            ตั้งค่า
          </MenuButton>
          <MenuList color={"gray.600"}>
            {authCtx.program.includes("Store") ? (
              <>
                <MenuItem onClick={() => navigate("/zone")}>จัดการโซน</MenuItem>
                <MenuItem onClick={() => navigate("/channel")}>
                  จัดการช่อง
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem>จัดการกล่อง</MenuItem>
                <MenuItem>จัดการชั้น</MenuItem>
              </>
            )}
            <MenuDivider />
            <MenuItem
              color={"red.600"}
              icon={<RiLogoutBoxLine />}
              onClick={handleLogout}
            >
              ออกจากระบบ
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}

export default Navbar;
