import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const signUp = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing either name, email, or password");
  }

  const newUser = new User({
    name,
    email,
    password,
    isAdmin,
  });
  const savedUser = await newUser.save();
  res.status(200).json({
    message: "signed up",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("user does not exist");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("incorrect password");
  }
  const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  res.status(200).json({ message: "logged in", token });
});

const getAccountInfo = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const updateAccountInfo = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(400);
    throw new Error("User does not exist with that id");
  }
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password || user.password;
  const savedUser = await user.save();
  const userObject = savedUser.toObject();
  delete userObject.password;
  res.status(200).json(userObject);
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const test = await User.findOneAndDelete({ _id });
  console.log(test);
  res.status(200).json(req.user);
});

const buyBook = asyncHandler(async (req, res) => {
  const { bookId, quantity, orderId, orderStatus } = req.body;
  if (!bookId || !quantity || !orderId || !orderStatus) {
    res.status(400);
    throw new Error("Missing book items");
  }
  if (
    !mongoose.Types.ObjectId.isValid(bookId) ||
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(400);
    throw new Error("User does not exist with that id");
  }
  user.cart = [...user.cart, { bookId, quantity }];
  user.orderStatus = [...user.orderStatus, { orderId, orderStatus }];
  const savedUser = await user.save();
  res.status(200).json(savedUser);
});

const cancelPurchase = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const { orderId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const user = await User.findById(req.user._id).select("-password");
  user.cart = user.cart.filter((cartObj) => cartObj.bookId !== bookId);
  user.orderStatus = user.orderStatus.map((orderStatusObj) => {
    if (orderStatusObj.orderId === orderId) {
      return { orderId, status: "cancelled" };
    } else {
      return orderStatusObj;
    }
  });
  const savedUser = await user.save();
  res.status(200).json(savedUser);
});

export {
  signUp,
  login,
  getAccountInfo,
  updateAccountInfo,
  deleteAccount,
  buyBook,
  cancelPurchase,
};
