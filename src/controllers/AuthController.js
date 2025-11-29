import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const AGE_LIMIT = 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JSON_WEB_TOKEN_SECRET, {
    expiresIn: AGE_LIMIT,
  });
};
export const signup_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: AGE_LIMIT * 1000,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

export const login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    await User.login(username, password).then((user) => {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: AGE_LIMIT * 1000,
      });
      res.status(200).json({ user: user._id });
    });
  } catch (err) {
    res.status(400).json({ message: "Error logging in", error: err.message });
  }
};
