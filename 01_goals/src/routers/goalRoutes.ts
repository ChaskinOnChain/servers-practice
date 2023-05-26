import express from "express";
import {
  viewGoals,
  addGoal,
  deleteGoal,
  updateGoal,
} from "../controllers/goalControllers";
import validateJWT from "../middleware/validateJWT";
const goalRouter = express.Router();

goalRouter.route("/").get(validateJWT, viewGoals).post(validateJWT, addGoal);
goalRouter
  .route("/:id")
  .delete(validateJWT, deleteGoal)
  .put(validateJWT, updateGoal);

export default goalRouter;
