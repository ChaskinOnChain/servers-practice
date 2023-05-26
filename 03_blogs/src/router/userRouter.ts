import express from "express";
import {
  deleteUser,
  logIn,
  signUp,
  updateUserInfo,
  viewUsers,
} from "../controllers/userControllers";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";

const userRouter = express.Router();

userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);
userRouter
  .route("/me")
  .put(verifyJWT, updateUserInfo)
  .delete(verifyJWT, deleteUser);

const adminRouter = express.Router();

adminRouter.route("/").get(verifyJWT, verifyAdmin, viewUsers);

export { userRouter, adminRouter };
