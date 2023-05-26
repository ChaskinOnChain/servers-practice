import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  toResponseObject(token: string): any; // add your method here
}

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    min: 3,
    max: 50,
    required: [true, "You need a name"],
  },
  email: {
    type: String,
    min: 3,
    max: 255,
    required: [true, "You need a email"],
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    min: 3,
    max: 50,
    required: [true, "You need a password"],
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(this.password, salt);
    this.password = newPassword;
  }
  next();
});

userSchema.methods.toResponseObject = function (token: string) {
  const { _id, email, name } = this;
  return {
    id: _id,
    email,
    name,
    token,
  };
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
