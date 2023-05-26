import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import Blog from "../models/blogModel";

const postBlog = asyncHandler(async (req, res) => {
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
  res.status(200).json({ message: "signed up", data: savedBlog });
});

const viewYourOwnBlogs = asyncHandler(async (req, res) => {
  const usersBlogs = await Blog.find({ author: req.user._id });
  res.status(200).json({ message: "your blogs", data: usersBlogs });
});

const viewBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(400);
    throw new Error("No blogs with that id");
  }
  res.status(200).json({ message: "your blog", data: blog });
});

const comment = asyncHandler(async (req, res) => {
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
});

const viewComments = asyncHandler(async (req, res) => {
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
});

const searchBlogs = asyncHandler(async (req, res) => {
  const { search } = req.query;
  if (!search) {
    res.status(400);
    throw new Error("Nothing to search");
  }
  const blogs = await Blog.find();
  let match = [];
  blogs.forEach((blog) => {
    if (blog.title.includes(search) || blog.tags.includes(search)) {
      match.push(blog);
    }
  });
  res.status(200).json({ message: "search results", data: match });
});

export {
  postBlog,
  viewYourOwnBlogs,
  viewBlog,
  comment,
  viewComments,
  searchBlogs,
};
