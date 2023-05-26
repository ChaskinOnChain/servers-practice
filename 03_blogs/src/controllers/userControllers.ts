import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

const signUp = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Missing info");
  }
  const newUser = new User({
    username,
    email,
    password,
    role,
  });
  const savedUser = await newUser.save();
  res.status(200).json({ message: "signed up" });
});

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !email) {
    res.status(400);
    throw new Error("Missing info");
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Wrong login info");
  }

  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.status(200).json({ token });
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email && !password) {
    res.status(400);
    throw new Error("Nothing to update");
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("No user");
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.password = password || user.password;
  await user.save();
  res.status(200).json({ message: "Info updated" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("No user");
  }
  await User.findByIdAndDelete(req.user._id);
  res.status(200).json({ message: "Account deleted" });
});

const viewUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

export { signUp, logIn, updateUserInfo, deleteUser, viewUsers };
