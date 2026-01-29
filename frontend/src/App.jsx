import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Routeing from "./pages/Route";
import EcoBot from "./pages/EcoBot";
import Presentation from "./pages/Pitch";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/routes" element={<Routeing />} />
      <Route path="/chat" element={<EcoBot />} />
      <Route path="/pitch" element={<Presentation />}/>
    </Routes>
  );
};

export default App;
