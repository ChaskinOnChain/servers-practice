import express, { urlencoded } from "express";
import cors from "cors";
import { userRouter, adminRouter } from "./router/userRouter";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogsRouter from "./router/blogsRouter";
dotenv.config();

mongoose.connect(process.env.MONGO_URI!);

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/blogs", blogsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
