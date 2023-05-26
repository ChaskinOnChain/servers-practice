import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import booksRouter from "./routes/booksRoutes";
dotenv.config();

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
    }
  } catch (error) {
    console.log(error);
  }
};

connectDB();

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/users", userRouter);
app.use("/books", booksRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
