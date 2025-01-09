import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "./../controllers/payment.controller.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-checkout-session", auth, createCheckoutSession);
paymentsRouter.post("/checkout-success", auth, checkoutSuccess);

export default paymentsRouter;
