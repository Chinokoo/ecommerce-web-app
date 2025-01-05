import express from "express";
import { getProducts } from "../controllers/product.controller.js";
import { admin, auth } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.get("/", auth, admin, getProducts);

export default productRouter;
