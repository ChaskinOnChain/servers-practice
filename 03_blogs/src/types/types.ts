import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Request } from "express";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  img?: string;
  email: string;
  password: string;
  blogs?: mongoose.Types.ObjectId[];
  role: "admin" | "user";
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}

export interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}
