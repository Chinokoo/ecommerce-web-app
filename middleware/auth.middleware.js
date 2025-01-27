import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

export const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken)
      return res.status(401).json({ message: "Sign in to buy products" });

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not Found" });

    req.user = user;

    next();
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
};

export const admin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Access Denied - Admin Only" });
};
