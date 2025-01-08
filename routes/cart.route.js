import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  removeFromCart,
  addToCart,
  getCartProducts,
  updateCartQuantity,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/", auth, addToCart);
cartRouter.get("/", auth, getCartProducts);
//deletes the entire product in cart.
cartRouter.delete("/", auth, removeFromCart);

cartRouter.put("/:id", auth, updateCartQuantity);

export default cartRouter;
