import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    min: 3,
    max: 50,
    required: [true, "You must include a username"],
  },
  img: String,
  email: {
    type: String,
    min: 3,
    max: 255,
    required: [true, "You must include an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    min: 3,
    max: 50,
    required: [true, "You must include a password"],
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default mongoose.model("User", UserSchema);
