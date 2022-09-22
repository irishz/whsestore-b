import { AiFillHome } from "react-icons/ai";

const base_url_store_s = "/store-s";
const base_url_store_b = "/store-b";
const base_url_std = "/std";

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
    {
      name: "Divider",
      divider: true,
      url: "#",
    },
  ],
  menu_store_b: [
    {
      name: "หน้าแรก",
      icon: <AiFillHome />,
      url: "/",
    },
    {
      name: "จำหน่าย Item",
      url: `${base_url_store_b}/delete-loc`,
    },
    {
      name: "ค้นหา Material",
      url: `${base_url_store_b}/find-matl`,
    },
    {
      name: "คำนวน Material",
      url: `${base_url_store_b}/cal-matl`,
    },
    {
      name: "ตรวจสอบการจ่าย Matl",
      url: `${base_url_store_b}/check-matlissue`,
    },
  ],
  menu_std: [
    {
      name: "หน้าแรก",
      icon: <AiFillHome />,
      url: "/",
    },
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
