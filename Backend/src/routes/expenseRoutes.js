import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

// All expense routes require being logged in (handled by session check in controller,
// but often routes have a middleware too. Research showed no generic 'isAuthenticated' middleware
// in the middlewares folder, so I'll rely on controller-level checks for now or add one if I find it.)

router.post("/", addExpense);
router.get("/", getExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
