import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const couponRouter = express.Router();

couponRouter.get("/", auth, getCoupon);
couponRouter.get("/validate-coupon", auth, validateCoupon);

export default couponRouter;
