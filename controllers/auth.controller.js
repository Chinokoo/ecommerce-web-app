import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../utils/redis.js";

//function to generate access and refresh tokens
const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET_TOKEN, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

//storing the refresh token in redis
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7 days expiry date.
};
//setting cookies for accessToken and refreshToken
const setCookie = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents cross-site request forgery attacks
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents cross-site request forgery attacks
    maxAge: 15 * 60 * 1000,
  });
};

//signup function
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name == null || password == null || email == null)
      return res.status(400).json({ message: "Enter all fields." });

    if (name.length < 3 || name == null)
      return res.status(400).json({
        message: "name must be at least 3 characters long or  name is empty",
      });
    if (password.length < 3 || password == null)
      return res.status(400).json({
        message:
          "password must be at least 7 characters long or  password is empty",
      });
    if (email == null)
      return res.status(400).json({ message: "email is empty" });

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
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookie(res, accessToken, refreshToken);

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
      const { accessToken, refreshToken } = generateToken(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookie(res, accessToken, refreshToken);

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
    res.status(500).json({ message: "internal server error" });
  }
};

//signout function
export const signout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "user signed out successfully" });
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "refresh token is missing" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN);
    if (!decoded)
      return res.status(401).json({ message: "Invalid refresh token" });

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", //prevents cross-site request forgery attacks
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ message: "access token refreshed successfully" });
  } catch (error) {
    console.log(error.message);
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
