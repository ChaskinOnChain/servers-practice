import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: { type: Number, min: 0, max: 5 },
  comment: { type: String, max: 500 },
});

const bookSchema = new Schema({
  title: {
    type: String,
    max: 500,
    required: [true, "You need to include a title"],
  },
  author: { type: String, max: 500 },
  publicationDate: Date,
  price: {
    type: Number,
    min: 0,
    max: 2000,
    required: [true, "You need to include a price"],
  },
  reviews: [reviewSchema],
});

export default mongoose.model("Book", bookSchema);
