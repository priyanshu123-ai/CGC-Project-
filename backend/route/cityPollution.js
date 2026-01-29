import express from "express"
import { cityPollutionController } from "../controller/cityPollutionController.js"

const city = express.Router()

city.post("/city",cityPollutionController)

export default city;