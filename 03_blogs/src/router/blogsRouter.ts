import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import verifyAdmin from "../middleware/verifyAdmin";
import {
  comment,
  postBlog,
  searchBlogs,
  viewBlog,
  viewComments,
  viewYourOwnBlogs,
} from "../controllers/blogControllers";

const blogsRouter = express.Router();

blogsRouter.route("/search").get(verifyJWT, searchBlogs);
blogsRouter
  .route("/")
  .post(verifyJWT, postBlog)
  .get(verifyJWT, viewYourOwnBlogs);
blogsRouter.route("/:id").get(verifyJWT, viewBlog).post(verifyJWT, comment);
blogsRouter.route("/:id/comments").get(verifyJWT, viewComments);

export default blogsRouter;
