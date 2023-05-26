import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const CartItemSchema = new Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  quantity: Number,
});

const OrderStatusSchema = new Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: String,
});

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart: (typeof CartItemSchema)[];
  orderStatus: (typeof OrderStatusSchema)[];
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "You need to include a name"],
  },
  email: {
    type: String,
    required: [true, "You need to include an email"],
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "You need to include a password"],
  },
  isAdmin: { type: Boolean, default: false },
  cart: [CartItemSchema],
  orderStatus: [OrderStatusSchema],
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
