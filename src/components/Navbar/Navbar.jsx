import {
  Avatar,
  Box,
  Button,
  Divider,
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
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import NavbarMenuList from "./NavbarData";

function Navbar() {
  const authCtx = useContext(AuthContext);
  const [userData, setuserData] = useState({});
  const [programMode, setprogramMode] = useState(
    localStorage.getItem("program")
  );
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
    setprogramMode(null);
    localStorage.removeItem("program");
    localStorage.removeItem("historyScan");
  }

  return (
    <Flex
      justify={"space-between"}
      p={3}
      bgColor={"#7097A8"}
      color="white"
      alignItems={"center"}
      mb={5}
    >
      {/* Left Menu */}
      <Box display={{ lg: "flex", sm: "none" }} gap={3}>
        {NavbarMenuList.menu_store_s.map((data) => (
          <Link to={data.url} key={data.name}>
            <Text
              display="inline-flex"
              alignItems={"center"}
              gap={1}
              _hover={{
                color: "#ECD59F",
                borderBottomColor: "#ECD59F",
                borderBottomWidth: 1,
                pb: 1,
              }}
            >
              {data.icon}
              {data.name}
            </Text>
          </Link>
        ))}
      </Box>
      <Box display={{ lg: "none", sm: "block" }}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
          />
          <MenuList color={"gray.600"}>
            {NavbarMenuList.menu_store_s.map((data) => (
              <Link to={data.url} key={data.name}>
                <MenuItem>{data.name}</MenuItem>
              </Link>
            ))}
          </MenuList>
        </Menu>
      </Box>
      {/* Right Menu */}
      <Box display={"inline-flex"} gap={3} alignItems="center">
        <Avatar name={userData.name} size="sm" />
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
            {programMode.includes("Store") ? (
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
              icon={<BsFillPersonFill size={16} />}
              onClick={() => navigate("/user")}
            >
              จัดการผู้ใช้
            </MenuItem>
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
