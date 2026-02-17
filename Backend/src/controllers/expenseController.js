import Expense from "../models/expense.model.js";

export const addExpense = async (req, res) => {
  try {
    const { category, amount, date, description, branchId } = req.body;
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Role check: Only admin can add expenses
    if (req.session.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can add expenses." });
    }

    if (!category || !amount || !date || !branchId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = await Expense.create({
      ownerId,
      branchId,
      category,
      amount,
      date,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { branchId, startDate, endDate, category } = req.query;
    const ownerId = req.session.ownerId;

    if (!ownerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let query = { ownerId };

    if (branchId) {
      query.branchId = branchId;
    }

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await Expense.find(query).sort({
      date: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, date, description } = req.body;

    if (req.session.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can update expenses." });
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      { category, amount, date, description },
      { new: true },
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.session.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can delete expenses." });
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
};
