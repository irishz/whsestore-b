import React, { useEffect, useState } from "react";
import { Container, Box } from "@chakra-ui/react";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import AuthContext from "./Context/AuthContext";
import axios from "axios";
import { variables } from "./Variables";
import jwtDecode from "jwt-decode";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";
import StoreSHome from "./components/StoreS/StoreSHome";
import StoreBHome from "./components/StoreB/StoreBHome";
import STDHome from "./components/STD/STDHome";
import Zone from "./components/Zone/Zone";
import ZoneCreate from "./components/Zone/ZoneCreate";

function App() {
  const [userToken, setuserToken] = useState(localStorage.getItem("token"));
  const [program, setprogram] = useState([]);

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
        setprogram: setprogram,
        program,
      }}
    >
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store-s" element={<StoreSHome />} />
          <Route path="/store-b" element={<StoreBHome />} />
          <Route path="/zone">
            <Route index element={<Zone />} />
            <Route path="/zone/create" element={<ZoneCreate />} />
          </Route>
          <Route path="/channel" element={<StoreBHome />} />
          <Route path="/std" element={<STDHome />} />
        </Routes>
      </Box>
    </AuthContext.Provider>
  );
}

export default App;
