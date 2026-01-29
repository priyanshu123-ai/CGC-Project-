import express from "express"
import { singleUpload } from "../middleware/multer.js"
import { login, logout, register } from "../controller/UserController.js"

const userRouter = express.Router()

userRouter.post("/register",singleUpload,register)
userRouter.post("/login",login)
userRouter.get("/logout",logout)

export default userRouter