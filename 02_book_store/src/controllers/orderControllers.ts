import asyncHandler from "express-async-handler";
import Order from "../models/orderModel";
import mongoose from "mongoose";
import Book from "../models/bookModel";

const seeOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.status(200).json(orders);
});

const placeOrder = asyncHandler(async (req, res) => {
  const { bookId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  if (!quantity) {
    res.status(400);
    throw new Error("You need to include a quantity");
  }
  let totalPrice;
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  totalPrice = book.price * quantity;
  const newOrder = new Order({
    userId: req.user._id,
    bookInfo: [{ bookId, quantity }],
    totalPrice,
    status: "pending",
  });
  const savedOrder = await newOrder.save();
  res.status(200).json(savedOrder);
});

const getSpecificOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const order = await Order.findById(id);
  if (!order) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  res.status(200).json(order);
});

const updateSpecificOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const { status } = req.body;
  if (!status) {
    res.status(400);
    throw new Error("You need to include a status");
  }
  const order = await Order.findById(id);
  if (!order) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  order.status = status;
  await order.save();
  res.status(200).json(status);
});

const deleteSpecificOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const order = await Order.findById(id);
  if (!order) {
    res.status(400);
    throw new Error("order does not exist with that id");
  }
  order.status = "cancelled";
  await Order.findByIdAndDelete(id);
  res.status(200).json(order);
});

export {
  seeOrders,
  placeOrder,
  getSpecificOrder,
  updateSpecificOrder,
  deleteSpecificOrder,
};
