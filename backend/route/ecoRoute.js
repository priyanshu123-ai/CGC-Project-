import express from "express";
import {
  ecoScoreController,
  getLatestAssessment,
  getLeaderboard,
  updateEcoAssessment
} from "../controller/ecoScoreController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const eco = express.Router();

// CREATE assessment
eco.post("/eco", isAuthenticated, ecoScoreController);

// GET latest assessment (userId from JWT)
eco.get("/eco/latest", isAuthenticated, getLatestAssessment);

// UPDATE assessment
eco.put("/eco/update/:assessmentId", isAuthenticated, updateEcoAssessment);

eco.get("/leader",isAuthenticated,getLeaderboard)



export default eco;