import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { email, password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const data = await User.create({
      email: email,
      password: hashedPassword,
    });
    res.status(201).json(
      {
        suceess: true,
        data,
      },
      { session }
    );
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    res.status(200).json({ success: true, token, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
