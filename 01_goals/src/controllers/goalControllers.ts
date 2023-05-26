import asyncHandler from "express-async-handler";
import Goal from "../models/goalModel";

const viewGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find();
  res.status(200).json(goals);
});

const addGoal = asyncHandler(async (req, res) => {
  if (!req.body || !req.body.text) {
    res.status(400);
    throw new Error("No text field included");
  }

  const newGoal = new Goal({ ...req.body, user: req.user });

  const savedGoal = await newGoal.save();

  res.status(200).json(savedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error(`Goal with id ${id} does not exist`);
  }

  await Goal.findByIdAndDelete(id);

  res.status(200).json({ message: `Goal with id ${id} deleted` });
});

const updateGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(400);
    throw new Error(`Goal with id ${id} does not exist`);
  }

  goal.text = req.body.text || goal.text;

  const updatedGoal = await goal.save();

  res.status(200).json(updatedGoal);
});

export { viewGoals, updateGoal, deleteGoal, addGoal };
