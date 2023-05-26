import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";

const checkJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      res.status(401);
      throw new Error("Not Authorized!");
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    (req as any).user = user;
    next();
  } catch (error) {
    console.log(error.message);
    if (error.message === "Not Authorized!") {
      res.status(401).send("Not Authorized!");
    }
    if (error.message === "User not found") {
      res.status(400).send("User not found");
    }
    res.status(500).send("Server Error");
  }
};

export default checkJWT;
