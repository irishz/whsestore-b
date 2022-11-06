import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Login from "./components/Login/Login";
import AuthContext from "./Context/AuthContext";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import StoreHome from "./components/StoreS/StoreHome";
import STDHome from "./components/STD/STDHome";
import Zone from "./components/Zone/Zone";
import ZoneCreate from "./components/Zone/ZoneCreate";
import Channel from "./components/Channel/Channel";
import ChannelCreate from "./components/Channel/ChannelCreate";
import User from "./components/User/User";
import CreateLocation from "./components/StoreS/CreateLocation";
import MoveLocation from "./components/StoreS/MoveLocation";
import DeleteLocation from "./components/StoreB/DeleteLocation";
import StdBox from "./components/Box/StdBox";
import StdBoxCreate from "./components/Box/StdBoxCreate";
import Layer from "./components/Layer/Layer";
import LayerCreate from "./components/Layer/LayerCreate";
import FindMatl from "./components/StoreB/FindMatl";
import CalMatl from "./components/StoreB/CalMatl";
import CheckMatlIssue from "./components/StoreB/CheckMatlIssue";
import UserCreate from "./components/User/UserCreate";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { variables } from "./Variables";
import MatlTrans from "./components/StoreB/MatlTrans";
import CheckOnhand from "./components/StoreS/CheckOnhand";

function App() {
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));
  const [userData, setuserData] = useState({});

  useEffect(() => {
    setuserToken(localStorage.getItem("token"));
    if (userToken) {
    const userTokenDecoded = jwtDecode(userToken)
      axios
      .get(`${variables.API_URL}/users/${userTokenDecoded.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setuserData(res.data);
      });
    }
  }, []);

  if (!userToken) {
    return <Login setuserToken={setuserToken} />;
  }

  return (
    <AuthContext.Provider
      value={{
        setuserToken: setuserToken,
        userToken,
        userData,
      }}
    >
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store-s">
            <Route index element={<StoreHome />} />
            <Route path="create-loc" element={<CreateLocation />} />
            <Route path="move-loc" element={<MoveLocation />} />
            <Route path="check-onhand" element={<CheckOnhand />} />
          </Route>
          <Route path="/store-b">
            <Route index element={<StoreHome />} />
            <Route path="delete-loc" element={<DeleteLocation />} />
            <Route path="find-matl" element={<FindMatl />} />
            <Route path="cal-matl" element={<CalMatl />} />
            <Route path="check-matlissue" element={<CheckMatlIssue />} />
            <Route path="matltrans" element={<MatlTrans />} />
          </Route>
          <Route path="/zone">
            <Route index element={<Zone />} />
            <Route path="create" element={<ZoneCreate />} />
          </Route>
          <Route path="/channel">
            <Route index element={<Channel />} />
            <Route path="create" element={<ChannelCreate />} />
          </Route>
          <Route path="/box">
            <Route index element={<StdBox />} />
            <Route path="create" element={<StdBoxCreate />} />
          </Route>
          <Route path="/layer">
            <Route index element={<Layer />} />
            <Route path="create" element={<LayerCreate />} />
          </Route>
          <Route path="/user">
            <Route index element={<User />} />
            <Route path="create" element={<UserCreate />} />
          </Route>
          <Route path="/std" element={<STDHome />} />
        </Routes>
      </Box>
    </AuthContext.Provider>
  );
}

export default App;
