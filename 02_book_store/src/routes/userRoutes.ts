import express from "express";
import {
  buyBook,
  cancelPurchase,
  deleteAccount,
  getAccountInfo,
  login,
  signUp,
  updateAccountInfo,
} from "../controllers/userControllers";
import checkJWT from "../middleware/checkJWT";
import adminOnly from "../middleware/adminOnly";
import {
  deleteSpecificOrder,
  getSpecificOrder,
  placeOrder,
  seeOrders,
  updateSpecificOrder,
} from "../controllers/orderControllers";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter
  .route("/me")
  .get(checkJWT, getAccountInfo)
  .put(checkJWT, updateAccountInfo)
  .delete(checkJWT, deleteAccount);
userRouter.post("/me/cart", checkJWT, buyBook);
userRouter.delete("/me/cart/:id", checkJWT, cancelPurchase);
userRouter
  .route("/me/orders")
  .get(checkJWT, seeOrders)
  .post(checkJWT, placeOrder);
userRouter
  .route("/me/orders/:id")
  .get(checkJWT, getSpecificOrder)
  .put(checkJWT, adminOnly, updateSpecificOrder)
  .delete(checkJWT, deleteSpecificOrder);
export default userRouter;
