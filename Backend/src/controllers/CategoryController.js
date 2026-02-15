import Category from "../models/category.model.js";
import Service from "../models/services.model.js";
import Branch from "../models/branch.model.js";

// @desc    Get all categories for a branch
// @route   GET /api/categories/:branchId
export const getCategories = async (req, res) => {
  try {
    const { branchId } = req.params;
    const ownerId = req.session.ownerId;
    const role = req.session.role;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Authorization check
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: branchId, ownerId });
      if (!branch) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    } else if (role === "receptionist") {
      if (req.session.branchId.toString() !== branchId) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    }

    const categories = await Category.find({ branchId });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { branchId, name } = req.body;
    const ownerId = req.session.ownerId;
    const role = req.session.role;

    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Only admin or receptionist can create categories
    if (role === "admin") {
      const branch = await Branch.findOne({ _id: branchId, ownerId });
      if (!branch) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    } else if (role === "receptionist") {
      // Force the branchId to be the one from session
      req.body.branchId = req.session.branchId.toString();
    }

    const category = await Category.create({
      branchId: req.body.branchId || branchId,
      name,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category already exists in this branch",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category and its services
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.session.ownerId;
    const role = req.session.role;

    if (!ownerId || role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin access required.",
      });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Verify branch ownership
    const branch = await Branch.findOne({ _id: category.branchId, ownerId });
    if (!branch) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Cascading delete services
    await Service.deleteMany({ category: id });

    // Delete category
    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category and associated services deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
