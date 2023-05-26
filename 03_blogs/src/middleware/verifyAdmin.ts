import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types/types";

const verifyAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === "user") {
    throw new Error("Not Authorized");
  }
  next();
};

export default verifyAdmin;
