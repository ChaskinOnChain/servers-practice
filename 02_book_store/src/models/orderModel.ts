import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: { type: Number, min: 0, max: 100, required: true },
});

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "You need to include a user"],
  },
  bookInfo: [bookSchema],
  totalPrice: {
    type: Number,
    min: 0,
    max: 5000,
    required: [true, "You need to include a price"],
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
    required: true,
  },
});

export default mongoose.model("Order", orderSchema);
