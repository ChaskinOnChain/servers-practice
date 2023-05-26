import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
});

const BlogSchema = new Schema({
  title: { type: String, required: [true, "You need a title"], max: 500 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now() },
  content: { type: String, required: [true, "You need content"], max: 1000 },
  tags: [String],
  comments: [commentSchema],
});

export default mongoose.model("Blog", BlogSchema);
