import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateJWTTokenAndSetCookie } from "../utils/generateToken.js";

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

    res.status(200).json({ _id: user._id, username: user.username, profilePic: user.profilePic });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
