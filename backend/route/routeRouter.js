import express from "express"
import { routeController } from "../controller/routesController.js"

const geoRouter = express.Router()

geoRouter.post("/routes",routeController)

export default geoRouter