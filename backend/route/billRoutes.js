import express from "express";
import multer from "multer";
import { analyzeBill } from "../controller/billController.js";

const billrouter = express.Router();

// memory only (no storage)
const upload = multer({ storage: multer.memoryStorage() });

billrouter.post("/analyze", upload.single("bill"), analyzeBill);

export default billrouter;