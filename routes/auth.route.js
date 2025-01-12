import express from "express";
import {
  signup,
  signout,
  signin,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

//signing up the user
authRouter.post("/signup", signup);

//signing in the user
authRouter.post("/signin", signin);

//signing up the user
authRouter.post("/signout", auth, signout);

authRouter.post("/refresh-token", refreshToken);

authRouter.get("/profile", auth, getProfile);

export default authRouter;
