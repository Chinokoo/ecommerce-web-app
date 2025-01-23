import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { admin, auth } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

//create a product [admin only].
productRouter.post("/create", auth, admin, createProduct);
//get all products [admin only].
productRouter.get("/", auth, admin, getProducts);
//get featured products.[all even unauthenticated users can access this route]
productRouter.get("/featured-products", getFeaturedProducts);
//delete a product [admin only].
productRouter.delete("/:id", auth, admin, deleteProduct);
//get recommended products [authenticated users only].
productRouter.get("/recommendations", auth, getRecommendedProducts);
//get products by category [authenticated users only].
productRouter.get("/category/:category", getProductByCategory);

//update featured product [admin only].
productRouter.patch("/:id", auth, admin, toggleFeaturedProduct);

export default productRouter;
