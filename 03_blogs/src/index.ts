import express, { NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";
import { userRouter, adminRouter } from "./router/userRouter";
import mongoose from "mongoose";
import dotenv from "dotenv";
import blogsRouter from "./router/blogsRouter";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  });

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/blogs", blogsRouter);

app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
