import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { NextFunction, Response } from "express";
import { RequestWithUser, JwtPayloadWithId } from "../types/types";

const verifyJWT = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Not Authorized!");
    return;
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayloadWithId;
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401).send("Not Authorized!");
    return;
  }
  req.user = user;
  next();
};

export default verifyJWT;
