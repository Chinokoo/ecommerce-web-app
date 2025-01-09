import express from "express";
import { admin, auth } from "../middleware/auth.middleware.js";
import { getAnalytics } from "../controllers/analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/", auth, admin, getAnalytics);

export default analyticsRouter;
