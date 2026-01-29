import React from "react";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Routeing from "./pages/Route";
import "./leafletFix";
import EcoBot from "./pages/EcoBot";
import Login from "./pages/Login";
import Dasboard from "./components/Dasboard";
import Questionnaire from "./pages/Questionnaire";
import EcoProducts from "./pages/EcoProduct";
import PollutionSources from "./pages/PollutionSources";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

import SendChallenge from "./components/Challenge.jsx/SendChallenge";
import MyChallenges from "./components/Challenge.jsx/MyChallenges";
import AcceptChallenge from "./components/Challenge.jsx/AcceptChallenge";
import ChallengeDashboard from "./components/Challenge.jsx/ChallengeDashboard";
import Insights from "./pages/Insights";
import Presentation from "./pages/Pitch";
import BillScanner from "./pages/BillScanner";
import BillResult from "./pages/BillResult";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/routes" element={<Routeing />} />
        <Route path="/chat" element={<EcoBot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dasboard />} />
        <Route path="/questionnaire" element={<Questionnaire />} />

        <Route path="/recommendations" element={<EcoProducts />} />
        <Route path="/pollution" element={<PollutionSources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        <Route path="/send" element={<SendChallenge />}/>
        <Route path="/my-challenges" element={<MyChallenges />}/>

        <Route path="/accept-challenge/:id" element = {<AcceptChallenge />}/>

        <Route path="/challenge/:id" element={<ChallengeDashboard />} />

        <Route path="/insights" element = {<Insights />}/>
        <Route path="/pitch" element={<Presentation />}/>

        <Route path="/bill-scanner" element={<BillScanner />}/>

        <Route path="/bill-result" element = {<BillResult />}/>


      </Routes>
    </div>
  );
};

export default App;
