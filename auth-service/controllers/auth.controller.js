import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateJWTTokenAndSetCookie } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExist = await User.findOne({ username });
    if (isUserExist)
      return res.status(409).json({ message: "Username already exist" });
    const user = new User({ username, password: hashedPassword });

    generateJWTTokenAndSetCookie(user._id, username, res);

    await user.save();
    res.status(201).json({ message: "User signup successfully" });
  } catch (error) {
    console.log("Signup error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Auth failed" });

    const passwordMatched = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!passwordMatched)
      return res.status(401).json({ message: "Auth failed" });
    generateJWTTokenAndSetCookie(user._id, username, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const jwtVerify = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ message: "Authorized" });
    } catch (error) {
      console.log("Error while verifing the JWT token: ", error.message);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};
