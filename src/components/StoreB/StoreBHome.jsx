import { Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function StoreBHome() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      StoreBHome
      <Button onClick={() => navigate(-1)}>Go Back</Button>
    </div>
  );
}

export default StoreBHome;
