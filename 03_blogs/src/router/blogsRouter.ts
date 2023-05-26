import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import {
  comment,
  filterByTag,
  postBlog,
  searchBlogs,
  viewBlog,
  viewComments,
  viewYourOwnBlogs,
} from "../controllers/blogControllers";

const blogsRouter = express.Router();

blogsRouter.route("/search").get(verifyJWT, searchBlogs);
blogsRouter.route("/filter").get(verifyJWT, filterByTag);
blogsRouter.route("/:id").get(verifyJWT, viewBlog).post(verifyJWT, comment);
blogsRouter.route("/:id/comments").get(verifyJWT, viewComments);
blogsRouter
  .route("/")
  .post(verifyJWT, postBlog)
  .get(verifyJWT, viewYourOwnBlogs);

export default blogsRouter;
