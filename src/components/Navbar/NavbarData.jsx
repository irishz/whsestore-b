import { AiFillHome } from "react-icons/ai";

const base_url_store_s = "/store-s";
const base_url_store_b = "store-b";
const base_url_std = "std";

const NavbarMenuList = {
  menu_store_s: [
    {
      name: "หน้าแรก",
      icon: <AiFillHome />,
      url: "/",
    },
    {
      name: "เพิ่ม Item",
      url: `${base_url_store_s}/create-loc`,
    },
    {
      name: "ย้าย Location",
      url: `${base_url_store_s}/move-loc`,
    },
  ],
  menu_store_b: [
    {
      name: "เพิ่ม Item",
      url: "",
    },
    {
      name: "ย้าย Location",
      url: "",
    },
  ],
  menu_std: [
    {
      name: "เพิ่ม Item",
      url: "",
    },
    {
      name: "ย้าย Location",
      url: "",
    },
  ],
};

export default NavbarMenuList;
