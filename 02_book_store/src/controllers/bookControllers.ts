import asyncHandler from "express-async-handler";
import Book from "../models/bookModel";
import mongoose from "mongoose";

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  res.status(200).json(books);
});

const addBook = asyncHandler(async (req, res) => {
  const { title, author, publicationDate, price } = req.body;
  if (!title || !price) {
    res.status(400);
    throw new Error("Missing information");
  }
  const newBook = new Book({
    title,
    author,
    publicationDate,
    price,
  });
  const savedBook = await newBook.save();
  res.status(200).json(savedBook);
});

const getSpecificBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const book = await Book.findById(id);
  if (!book) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  res.status(200).json(book);
});

const updateSpecificBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const { title, author, publicationDate, price } = req.body;
  if (!title && !author && !publicationDate && !price) {
    res.status(400);
    throw new Error("You didn't include anything");
  }
  const book = await Book.findById(id);
  if (!book) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  book.title = title || book.title;
  book.author = author || book.author;
  book.publicationDate = publicationDate || book.publicationDate;
  book.price = price || book.price;
  const savedBook = await book.save();
  res.status(200).json(savedBook);
});

const deleteSpecificBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }

  res.status(200).json(book);
});

const addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }
  const { rating, comment } = req.body;
  if (!rating) {
    res.status(400);
    throw new Error("You didn't a review");
  }
  const book = await Book.findById(id);
  if (!book) {
    res.status(400);
    throw new Error("Book does not exist with that id");
  }
  book.reviews = [...book.reviews, { userId: req.user._id, rating, comment }];
  const savedBook = await book.save();
  res.status(200).json(savedBook);
});

export {
  getAllBooks,
  addBook,
  getSpecificBook,
  updateSpecificBook,
  deleteSpecificBook,
  addReview,
};
