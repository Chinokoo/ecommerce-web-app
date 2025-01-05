import express from "express";
import {
  signup,
  signout,
  signin,
  refreshToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

//signing up the user
authRouter.post("/signup", signup);

//signing in the user
authRouter.post("/signin", signin);

//signing up the user
authRouter.post("/signout", signout);

authRouter.post("/refresh-token", refreshToken);

export default authRouter;
