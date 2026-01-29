import express from "express";
import dotenv from "dotenv";
import database from "./utils/database.js";
import userRouter from "./route/UserRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import geoRouter from "./route/routeRouter.js";
import chat from "./route/chatRoute.js";
import eco from "./route/ecoRoute.js";
import city from "./route/cityPollution.js";
import router from "./route/challengeRoutes.js";
import AiRouter from "./route/ecoAi.js";
import billrouter from "./route/billRoutes.js";

dotenv.config();

const app = express();

/* ✅ CORS FIX */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ecosense-8.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

database();

/* ROUTES */
app.use("/api/v1", userRouter);
app.use("/api/v2", geoRouter);
app.use("/api/v3", chat);
app.use("/api/v4", eco);
app.use("/api/v5", city);
app.use("/api/v6", router);
app.use("/api/v7", AiRouter);
app.use("/api/v8", billrouter);

/* PORT (Render compatible) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});