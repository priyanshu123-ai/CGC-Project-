// routes/challengeRoutes.js
import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
  sendChallenge,
  acceptChallenge,
  declineChallenge,
  getMyChallenges,
} from "../controller/challengeController.js";
import { finishChallenge, getChallengeDetail } from "../controller/ecoActionAIController.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendChallenge);
router.post("/accept/:id", isAuthenticated, acceptChallenge);
router.post("/decline/:id", isAuthenticated, declineChallenge);

router.get("/my", isAuthenticated, getMyChallenges);

router.get("/:id", isAuthenticated, getChallengeDetail);
router.post("/finish/:id", isAuthenticated, finishChallenge);

export default router;