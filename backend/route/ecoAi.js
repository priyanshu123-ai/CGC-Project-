import express from "express"
import isAuthenticated from "../middleware/isAuthenticated.js"
import { applyEcoActionAI } from "../controller/ecoActionAIController.js"

const AiRouter = express.Router()

AiRouter.post("/recycle",isAuthenticated,applyEcoActionAI)






export default AiRouter