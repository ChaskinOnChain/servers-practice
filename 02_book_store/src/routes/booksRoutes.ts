import express from "express";
import {
  addBook,
  addReview,
  deleteSpecificBook,
  getAllBooks,
  getSpecificBook,
  updateSpecificBook,
} from "../controllers/bookControllers";
import checkJWT from "../middleware/checkJWT";
import adminOnly from "../middleware/adminOnly";

const booksRouter = express.Router();

booksRouter.route("/").get(getAllBooks).post(checkJWT, adminOnly, addBook);
booksRouter
  .route("/:id")
  .get(getSpecificBook)
  .put(checkJWT, adminOnly, updateSpecificBook)
  .delete(checkJWT, adminOnly, deleteSpecificBook);
booksRouter.route("/:id/reviews").post(checkJWT, addReview);

export default booksRouter;
