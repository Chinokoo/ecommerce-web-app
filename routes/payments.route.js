import express from "express";
import { auth } from "../middleware/auth.middleware.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-checkout-seesion", auth, createCheckoutSession);

export default paymentsRouter;
