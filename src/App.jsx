import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Login from "./components/Login/Login";
import AuthContext from "./Context/AuthContext";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import StoreSHome from "./components/StoreS/StoreSHome";
import StoreBHome from "./components/StoreB/StoreBHome";
import STDHome from "./components/STD/STDHome";
import Zone from "./components/Zone/Zone";
import ZoneCreate from "./components/Zone/ZoneCreate";
import Channel from "./components/Channel/Channel";
import ChannelCreate from "./components/Channel/ChannelCreate";
import User from "./components/User/User";
import CreateLocation from "./components/StoreS/CreateLocation";
import MoveLocation from "./components/StoreS/MoveLocation";

function App() {
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setuserToken(localStorage.getItem("token"));
  }, []);

  if (!userToken) {
    return <Login setuserToken={setuserToken} />;
  }

  return (
    <AuthContext.Provider
      value={{
        setuserToken: setuserToken,
        userToken,
      }}
    >
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store-s">
            <Route index element={<StoreSHome />} />
            <Route path="create-loc" element={<CreateLocation />} />
            <Route path="move-loc" element={<MoveLocation />} />
          </Route>
          <Route path="/store-b" element={<StoreBHome />} />
          <Route path="/zone">
            <Route index element={<Zone />} />
            <Route path="create" element={<ZoneCreate />} />
          </Route>
          <Route path="/channel">
            <Route index element={<Channel />} />
            <Route path="create" element={<ChannelCreate />} />
          </Route>
          <Route path="/user">
            <Route index element={<User />} />
          </Route>
          <Route path="/std" element={<STDHome />} />
        </Routes>
      </Box>
    </AuthContext.Provider>
  );
}

export default App;
