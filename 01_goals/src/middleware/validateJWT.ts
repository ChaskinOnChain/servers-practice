import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/usersModel";
import { Document } from "mongoose";

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: Document;
    }
  }
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(400);
      throw new Error("No user!");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).send("Unauthorized: Invalid token");
  }
};

export default validateJWT;
