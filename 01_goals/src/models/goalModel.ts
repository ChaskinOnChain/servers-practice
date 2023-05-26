import mongoose from "mongoose";
const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "You need to include a goal"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "You need to include a user"],
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
