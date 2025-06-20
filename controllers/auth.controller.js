import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//function to generate access and tokens
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });

  return { accessToken };
};

//setting cookies for accessToken and refreshToken
const setCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    credentials: true, //prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", //prevents cross-site request forgery attacks
    maxAge: 15 * 60 * 1000,
  });
};

//signup function
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name == null || password == null || email == null)
      return res.status(400).json({ message: "Enter all fields." });

    if (name.length < 3)
      return res.status(400).json({
        message: "name must be at least 3 characters long or  name is empty",
      });
    if (password.length < 7)
      return res.status(400).json({
        message:
          "password must be at least 7 characters long or  password is empty",
      });

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ message: "user with this email already exists" });

    user = await User.create({
      name,
      email,
      password,
    });

    //authenticate user.
    const { accessToken } = generateToken(user._id);
    setCookie(res, accessToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "user created successfully",
    });
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
    console.log(e);
  }
};
//login function
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email == null || password == null)
      return res.status(400).json({ message: "Enter all fields." });

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "Invalid Credentials, try again" });

    if (user && (await user.comparePassword(password))) {
      const { accessToken } = generateToken(user._id);

      setCookie(res, accessToken);

      res.status(200).json({
        message: "user signed in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid Credentials, try again" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
};

//signout function
export const signout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.status(200).json({ message: "user signed out successfully" });
  } catch (e) {
    console.log("error in signout function", e);
    res.status(500).json({ message: "internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("error in getProfile", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
