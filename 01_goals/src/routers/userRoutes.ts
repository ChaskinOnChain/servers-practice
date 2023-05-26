import express from "express";
import { register, login, getMe } from "../controllers/userControllers";
import validateJWT from "../middleware/validateJWT";

const userRouter = express.Router();

userRouter.post("/", register);
userRouter.post("/login", login);
userRouter.get("/me", validateJWT, getMe);

export default userRouter;
