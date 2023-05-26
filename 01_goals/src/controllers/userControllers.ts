import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/usersModel";
import asyncHandler from "express-async-handler";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing login content");
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  const savedUser = await newUser.save();
  const userResponseObject = savedUser.toResponseObject(
    generateJWT(savedUser._id.toString())
  );

  res.status(200).json(userResponseObject);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("No email or password!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Email does not exist");
  }
  console.log(user);

  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Invalid Password");
  }

  const userResponseObject = user.toResponseObject(
    generateJWT(user._id.toString())
  );

  res
    .status(200)
    .json({ message: "login successful", data: userResponseObject });
});

function generateJWT(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
}

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export { register, login, getMe };
