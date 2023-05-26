import { NextFunction, Request, Response } from "express";

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user.isAdmin) {
    res.status(401);
    throw new Error("Not Authorized!");
  }
  next();
};

export default adminOnly;
