import express from "express";
import cors from "cors";
import goalRouter from "./routers/goalRoutes";
import userRouter from "./routers/userRoutes";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const port = 3000;

const app = express();

async function connectDB() {
  try {
    if (!process.env.MONGO) {
      throw new Error("No db");
    }
    await mongoose.connect(process.env.MONGO);
  } catch (error) {
    console.log(error);
  }
}
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/goals", goalRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
