import { Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function StoreSHome() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      StoreSHome
      <Button onClick={() => navigate(-1)}>Go back</Button>
    </div>
  );
}

export default StoreSHome;
