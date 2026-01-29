import express from "express"
import { ecoBotController } from "../controller/chatController.js"

const chat = express.Router()

chat.post("/chat",ecoBotController)

export default chat