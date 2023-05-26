import jwt from "jsonwebtoken";
import User from "../models/userModel";

const verifyJWT = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(401);
    throw new Error("Not Authorized!");
  }
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Not Authorized!");
  }
  req.user = user;
  next();
};

export default verifyJWT;
