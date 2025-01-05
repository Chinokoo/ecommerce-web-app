import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products)
      return res.status(404).json({ message: "products not found" });

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
