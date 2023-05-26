import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const validateEthereumAddress = (address: string) => {
  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethereumAddressRegex.test(address);
};

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
  ethereum_address: {
    type: String,
    validate: {
      validator: validateEthereumAddress,
      message: "Please provide a valid Ethereum address",
    },
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
