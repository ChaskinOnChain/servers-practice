import asyncHandler from "express-async-handler";
import Blog from "../models/blogModel";
import { RequestWithUser } from "../types/types";
import { Response } from "express";

const postBlog = async (req: RequestWithUser, res: Response) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      res.status(400);
      throw new Error("Missing content or title");
    }
    const blog = new Blog({
      title,
      author: req.user._id,
      content,
      tags,
    });
    const savedBlog = await blog.save();
    res.status(200).json({ message: "blog posted", data: savedBlog });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const viewYourOwnBlogs = async (req: RequestWithUser, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: "desc" },
    };
    const query = { author: req.user._id };
    const result = await Blog.paginate(query, options);
    res.status(200).json({ message: "your blogs", data: result });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const viewBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(400);
    throw new Error("No blogs with that id");
  }
  res.status(200).json({ message: "your blog", data: blog });
});

const comment = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(400);
      throw new Error("No blogs with that id");
    }
    const { comment } = req.body;
    if (!comment) {
      res.status(400);
      throw new Error("No comment");
    }
    blog.comments = [...blog.comments, { user: req.user._id, comment }];
    await blog.save();
    res.status(200).json({ message: "comment successful", data: blog });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const viewComments = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(400);
      throw new Error("No blogs with that id");
    }
    if (req.user._id.toString() !== blog.author.toString()) {
      res.status(400);
      throw new Error("Not your blog");
    }
    res.status(200).json({ message: "your comments", comments: blog.comments });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const searchBlogs = async (req: RequestWithUser, res: Response) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    if (!search) {
      res.status(400);
      throw new Error("Nothing to search");
    }
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: "desc" }, // Sort by creation date in descending order
    };

    const query = { $text: { $search: search } };

    const result = await Blog.paginate(query, options);
    res.status(200).json({
      message: "Search results",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const deletePostOrComment = async (req: RequestWithUser, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(400);
      throw new Error("No blogs with that id");
    }
    const deleted = await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "delete successfull", data: deleted });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

const filterByTag = async (req: RequestWithUser, res: Response) => {
  try {
    const tags = req.query.tags;
    console.log(tags);
    if (!tags) {
      res.status(400);
      throw new Error("Nothing to search");
    }
    const blogs = await Blog.find();
    let match: (typeof Blog)[] = [];
    blogs.forEach((blog) => {
      if (Array.isArray(tags)) {
        if (tags.some((tag) => blog.tags.includes(tag))) {
          match.push(blog);
        }
      } else if (typeof tags === "string") {
        if (blog.tags.includes(tags)) {
          match.push(blog);
        }
      }
    });
    res.status(200).json({ message: "tag results", data: match });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Something went wrong");
  }
};

export {
  postBlog,
  viewYourOwnBlogs,
  viewBlog,
  comment,
  viewComments,
  searchBlogs,
  deletePostOrComment,
  filterByTag,
};
