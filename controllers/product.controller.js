import Product from "../models/product.model.js";
import cloudinary from "../utils/cloudinary.js";
import { redis } from "../utils/redis.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;

    if (image)
      cloudinaryResponse = await cloudinary.uploader(image, {
        folder: "products",
      });

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json({ product, message: "product created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
export const getFeaturedProducts = async (req, res) => {
  try {
    let products = await redis.get("featured_products");

    if (products) return res.json(JSON.parse(products));

    products = await Product.find({ isFeatured: true }).lean();

    if (!products)
      return res.status(404).json({ message: "Featured products not found" });

    await redis.set("featured_products", JSON.stringify(products));

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "product not found" });
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("image deleted from cloudinary");
      } catch (error) {
        console.log("error deleting image from cloudinary", error);
      }
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "product deleted successfully" });
    }
  } catch (error) {
    console.log("error in deleteProduct", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.status(200).json({ products });
  } catch (error) {
    console.log("error in getRecommendedProducts", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("errror in getProductByCategory", error);
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "product not found" });

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    await updateFeaturedProductsCache();
    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("errror in toggleFeaturedProduct", error);
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); // the lean() method is used to return a plain object instead of a mongoose document to significantly improve performance.
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in updateFeaturedProductsCache", error);
  }
}
